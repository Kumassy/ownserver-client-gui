const { spawn } = require('child_process')

describe('Run Custom Server with Netcat', () => {
  it('can publish local server', async () => {
    ////
    // Select Custom
    {
      const minecraft = await $('aria/Minecraft Java Edition')
      await minecraft.click()

      const custom = await $('aria/Custom')
      await custom.click()

      const next = await $('button=Next')
      await next.waitUntil(async () => await next.isClickable(), {
        timeout: 5000,
        timeoutMsg: 'expected next button to be enabled in 5s'
      });
      await next.click()
    }


    ////
    // Fill out Custom form
    {

      const useLocalFeature = await $('span*=Enter the command')
      await useLocalFeature.click()

      const start = await $('button=Start')
      await start.waitUntil(async () => await start.isEnabled(), {
        timeout: 5000,
        timeoutMsg: 'expected start button to be enabled in 5s'
      });
      await start.waitUntil(async () => await start.isClickable(), {
        timeout: 5000,
        timeoutMsg: 'expected start button to be clickable in 5s'
      });
      await start.click()


      const next = await $('button=Next')
      await next.waitUntil(async () => await next.isEnabled(), {
        timeout: 5000,
        timeoutMsg: 'expected next button to be enabled in 5s'
      });
      await next.click()
    }

    ////
    // Configure ownserver
    //
    {
      const start = await $('button=Start')
      await start.click()

      const next = await $('button=Next')
      await next.waitUntil(async () => await next.isEnabled(), {
        timeout: 5000,
        timeoutMsg: 'expected next button to be enabled in 5s'
      })
      await next.click()
    }

    ////
    // Monitor
    //
    {
      const addressLabel = await $('p*=Your Public Address')
      const address = addressLabel.parentElement()

      await address.waitUntil(async function () {
        return (await address.getText()).includes('ownserver.kumassy.com')
      }, {
        timeout: 5000,
        timeoutMsg: 'expected public address to be available in 5s'
      })
      const addressText = await address.getText();
      console.log("Raw address text:", addressText);

      const addressMatch = addressText.match(/([a-zA-Z0-9\-]+\.ownserver\.kumassy\.com:\d+)/);
      if (!addressMatch) {
        throw new Error(`Failed to extract server address from: ${addressText}`);
      }
      const serverAddress = addressMatch[1]
      const [ip, port] = serverAddress.split(':')
      console.log("Extracted server address:", ip, port);

      // assert flag pattern is echo by local nc server via ownserver
      const flag = 'hello from webdriver'

      const nc = spawn('nc', [ip, port, '-N'], {
        input: flag,
        timeout: 30000
      })
      nc.stdin.write(`${flag}\n`);


      const terminal = await $('#local-server-inf')
      await terminal.waitUntil(async function () {
        return (await terminal.getText()).includes(flag)
      }, {
        timeout: 30000,
        timeoutMsg: `expected flag ${flag} to be available in 30s`
      });

      nc.stdin.end()
    }

    // make sure to increase mochaOpts.timeout
    // await browser.debug()
  })
})
