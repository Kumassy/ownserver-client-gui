describe('Publish Minecraft Game', () => {
    it('should be easy on the eyes', async () => {

        const body = await $('body')
        const backgroundColor = await body.getCSSProperty('background-color')

        await browser.debug()
        // expect(luma(backgroundColor.parsed.hex)).toBeLessThan(100)
    })
})
