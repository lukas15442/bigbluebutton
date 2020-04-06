const Page = require('./core/page');
const Share = require('./webcam/share');

describe('Webcam', () => {
  function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  test('Shares webcam', async () => {
    for (var index = 0; index < parseInt(process.env.NUMBERS_OF_WEBCAMS); index++) {
      const test = new Share();
      let response;
      try {
        await test.init(Page.getArgsWithVideo(), process.env.MEETING_ID);
        response = await test.test();
      } catch (e) {
        console.log(e);
      }
      expect(response).toBe(true);
      console.log(`${index + 1}/${parseInt(process.env.NUMBERS_OF_WEBCAMS)} started`);
    }
    await Sleep(process.env.JEST_TEST_DURATION * 1000);
  });
});
