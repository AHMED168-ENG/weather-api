import "jest";
import { jest } from "@jest/globals";

// إعادة تعيين الـ Mocks قبل كل Test
beforeEach(() => {
  jest.clearAllMocks();
});
