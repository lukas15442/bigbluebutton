const utilNotification = require('../notifications/util');
const Page = require('../core/page');
const params = require('../params');
const util = require('./util');

class Audio {
  constructor() {
    this.page1 = new Page();
    this.page2 = new Page();
  }

  // Join BigBlueButton meeting
  async init(args, meetingId, newInstanceName) {
    await this.page1.init(args, meetingId, newInstanceName);
    await this.page1.joinMicrophone();
  }

  async initOneUser(page, meetingId) {
    await page.init(Page.getArgsWithAudio(), meetingId, { ...params, fullName: 'User1' });
    await page.joinMicrophone();
  }

  async test() {
    const isTalkingIndicatorUser1 = await util.checkUserIsTalkingIndicator(this.page1);
    return isTalkingIndicatorUser1;
  }

  async mute() {
    // User1 mutes User2 & User2 mutes User1
    await util.mute(this.page1, this.page2);

    // User1 checks if he still can see User2 highlighting
    const wasTalkingIndicatorUser1 = await util.checkUserWasTalkingIndicator(this.page1);

    // User2 checks if he still can see User1 highlighting
    const wasTalkingIndicatorUser2 = await util.checkUserWasTalkingIndicator(this.page2);

    const doneCheckingIsTalkingIndicator = wasTalkingIndicatorUser1 && wasTalkingIndicatorUser2;
    const response = doneCheckingIsTalkingIndicator == true;
    return response;
  }

  async audioNotification(page) {
    const resp = await utilNotification.getLastToastValue(page);
    return resp;
  }

  async close() {
    this.page1.close();
    this.page2.close();
  }
}

module.exports = exports = Audio;
