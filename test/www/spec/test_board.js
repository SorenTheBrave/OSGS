describe("Board creation and management", () => {

    // Provide the test playground for all tests, emptying out any contents between each test
    let playground;

    beforeAll(() => {
        playground = getPlayground();
    });

    beforeEach(() => {
        playground.innerHTML = "";
        expect(playground.childElementCount).toEqual(0);
    });

    describe("Board lifecycle", () => {
        it("should be able to instantiate a new board when provided a parent element", () => {
            const newBoardSettings = {};
            const boardSpy = jasmine.createSpy(drawBoard);

            drawBoard(playground, newBoardSettings);

            expect(boardSpy).not.toThrow();
            expect(playground.childElementCount).toEqual(1);
        });
    });

    describe("Board Utility Functions", () => {
        it("should determine if a given element is an HTML div element", () => {
            const divElem = document.createElement("DIV");
            const notDivElem = document.createElement("SPAN");

            expect(isDivElement(divElem)).toBe(true);
            expect(isDivElement(notDivElem)).toBe(false);
        });

        it("should ensure validity of game settings", () => {
            const validSettings = {};

            expect(isValidBoardSettings(validSettings)).toBe(true);
        });

        it("should reject invalid game settings",() => {
            const invalidSettingsEmpty = {};
            const invalidSettingsMissingSize = {};
            const invalidSettingsMissingKomi = {};
            const invalidSettingsMissingPlayerInfo = {};
            const invalidSettingsPlayerInfoMalformed = {}; // For wrong types, e.g. for strings where numbers are expected
            // ... etc. This maybe should be its own describe block, because there are so many ways to F this up
            // extraneous elements should be silently ignored

            expect(isDivElement(invalidSettingsEmpty)).toBe(false);
            expect(isDivElement(invalidSettingsMissingSize)).toBe(false);
            expect(isDivElement(invalidSettingsMissingKomi)).toBe(false);
            expect(isDivElement(invalidSettingsMissingPlayerInfo)).toBe(false);
            expect(isDivElement(invalidSettingsPlayerInfoMalformed)).toBe(false);
        });
    });
});