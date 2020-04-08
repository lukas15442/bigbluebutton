const Audio = require('./audio/audio');
const Page = require('./core/page');

describe('Audio', () => {
  function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  async function startInstance(index, instanceName) {
    const newInstanceName = `${instanceName}_${index + 1}`;
    const test = new Audio();
    let response;
    try {
      await test.init(Page.getArgsWithAudio(), process.env.MEETING_ID, newInstanceName);
      response = await test.test();
    } catch (e) {
      console.log(e);
    }
    expect(response).toBe(true);
    console.log(
      `${index + 1}/${parseInt(process.env.NUMBERS_OF_WEBCAMS, 0)} started`,
    );
    return test;
  }

  function getRandom(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function getInstanceName() {
    // eslint-disable-next-line no-restricted-globals
    const hostname = location.hostname.slice(0, 10);
    const random = getRandom(5);
    return `${hostname}-${random}`;
  }

  // eslint-disable-next-line no-undef
  test('Stream Audio', async () => {
    const instanceName = getInstanceName();
    console.log(`Instance name: ${instanceName}`);

    const tests = [];
    for (let index = 0; index < parseInt(process.env.NUMBERS_OF_WEBCAMS, 0);
      index += 1) {
      tests.push(startInstance(index, instanceName));
    }
    await Promise.all(tests);
    await Sleep(process.env.JEST_TEST_DURATION * 1000);
    const closed = [];
    Promise.all(tests)
      .then((currentTests) => {
        for (let i = 0; i < tests.length; i += 1) {
          closed.push(currentTests[i].close());
        }
      });
    await Promise.all(closed);
  });
});
