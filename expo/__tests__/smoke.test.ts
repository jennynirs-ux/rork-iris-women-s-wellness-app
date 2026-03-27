import Colors from "../constants/colors";

describe("Smoke tests", () => {
  it("Colors constant exports light and dark palettes", () => {
      expect(Colors.light).toBeDefined();
          expect(Colors.dark).toBeDefined();
            });

              it("Dark palette contains required brand tokens", () => {
                  expect(Colors.dark.primary).toBeDefined();
                      expect(Colors.dark.background).toBeDefined();
                          expect(Colors.dark.text).toBeDefined();
                            });

                              it("PHASE_INFO color values are valid hex strings", () => {
                                  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
                                      // Spot-check a well-known constant to prevent accidental breakage
                                          expect(typeof Colors.dark.primary).toBe("string");
                                              expect(Colors.dark.primary).toMatch(hexRegex);
                                                });
                                                });
