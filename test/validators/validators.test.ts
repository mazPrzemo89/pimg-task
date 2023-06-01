import {
  validateImageFormat,
  validateDonwloadQuery,
} from "../../src/validators/validators";

export interface DownloadQuery {
  formatToConvert: string;
  widthToConvert: undefined | number;
  heightToConvert: undefined | number;
}

describe("validators test suite", () => {
  test("if validateImageFormat returns false when given invalid input", () => {
    const invalidFilename = "test.exe";
    const result = validateImageFormat(invalidFilename);
    expect(result).toBeFalsy();
  });

  test("if validateImageFormat returns true when given valid input", () => {
    const validFilename = "test.png";
    const result = validateImageFormat(validFilename);
    expect(result).toBeTruthy();
  });

  test("if validateDonwloadQuery thorws error on invalid dimmensions in query", () => {
    const invalidRequest = {
      query: {
        format: "jpeg",
        width: "not a number",
        height: 200,
      },
    };

    expect(() => validateDonwloadQuery(invalidRequest as any)).toThrow();
  });

  test("if validateDonwloadQuery thorws error on invalid file format in query", () => {
    const invalidRequest = {
      query: {
        format: "not a valid format",
        width: 200,
        height: 200,
      },
    };

    expect(() => validateDonwloadQuery(invalidRequest as any)).toThrow();
  });
});
