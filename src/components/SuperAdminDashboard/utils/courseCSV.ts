import { CSVCourse } from '../components/CourseBulkUploadModal';

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let insideQuotes = false;

  // Remove BOM if present
  const cleanLine = line.replace(/^\uFEFF/, '');

  for (let i = 0; i < cleanLine.length; i++) {
    const char = cleanLine[i];

    if (char === '"') {
      if (insideQuotes && cleanLine[i + 1] === '"') {
        // Handle escaped quotes
        currentValue += '"';
        i++;
      } else {
        // Toggle quotes state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }

  // Add the last field
  values.push(currentValue.trim());

  // Remove surrounding quotes from values
  return values.map((value) => value.replace(/^"(.*)"$/, '$1'));
}

export function parseCSVCourses(content: string): CSVCourse[] {
  try {
    // Split into lines and remove empty lines and BOM
    const lines = content
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .filter((line) => line.trim());

    if (lines.length < 2) {
      throw new Error(
        'CSV file must contain a header row and at least one data row'
      );
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]).map((header) =>
      header.toLowerCase().trim()
    );
    const requiredHeaders = [
      'course_name',
      'university_name',
      'location',
    ];

    // Validate headers
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`Missing required column: ${required}`);
      }
    }

    const courses: CSVCourse[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      try {
        const values = parseCSVLine(line);

        // Handle case where CSV might have fewer columns than headers
        // This can happen if trailing commas are missing for empty optional fields
        if (values.length < headers.length) {
          // Pad the values array with empty strings
          while (values.length < headers.length) {
            values.push('');
          }
        }
        
        // Validate row length
        if (values.length !== headers.length) {
          throw new Error(
            `Row ${i + 1} has ${values.length} columns but should have ${
              headers.length
            }`
          );
        }

        const course: Partial<CSVCourse> = {};

        headers.forEach((header, colIndex) => {
          const value = values[colIndex];

          // Validate required fields
          if (requiredHeaders.includes(header) && !value) {
            throw new Error(
              `Missing required value for ${header} in row ${i + 1}`
            );
          }

          switch (header) {
            case 'degree_type':
              // Use default if empty
              course[header] = value || 'Bachelor';
              break;
            default:
              course[header as keyof CSVCourse] = value;
          }
        });

        // Set default degree_type if not included in the headers
        if (!headers.includes('degree_type')) {
          course.degree_type = 'Bachelor';
        }

        courses.push(course as CSVCourse);
      } catch (error) {
        throw new Error(
          `Error in row ${i + 1}: ${
            error instanceof Error ? error.message : 'Invalid data'
          }`
        );
      }
    }

    return courses;
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to parse CSV file');
  }
} 