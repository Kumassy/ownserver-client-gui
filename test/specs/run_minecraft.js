const path = require('path');

describe('Run Minecraft Game', () => {
  it('can publish local server', async () => {
    ////
    // Select Minecraft
    // verify minecraft is selected
    {
      const minecraft = await $('aria/Minecraft Java Edition')
      await expect(minecraft).toBePresent()

      const next = await $('button=Next')
      await next.waitUntil(async () => await next.isClickable(), {
        timeout: 5000,
        timeoutMsg: 'expected next button to be enabled in 5s'
      });
      await next.click()
    }


    ////
    // Fill out Minecraft form
    // fill out server.jar file by simulating file drop
    {
      // https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
      const server_jar_path = path.join(
        process.env.GITHUB_WORKSPACE,
        'test-resources',
        'minecraft-java-vanilla',
        'server.jar'
      )
      console.log(`server_jar_path: ${server_jar_path}`)

      await browser.waitUntil(async () => {
        await browser.execute((server_jar_path) => {
          window.__TAURI_INTERNALS__.invoke('plugin:event|emit', {
            event: 'tauri://drag-drop',
            payload: {
              type: 'drop',
              paths: [server_jar_path],
              position: { x: 0, y: 0 }
            }
          })
        }, server_jar_path)

        try {
          const element = await $(`p*=${server_jar_path}`);
          return await element.isExisting();
        } catch (error) {
          return false;
        }
      }, {
        timeout: 5000,
        interval: 1000,
        timeoutMsg: 'expected drag-drop event to be emitted in 5s'
      })

      $('aria/Accept EULA').click()

      const start = await $('button=Start')
      await start.waitUntil(async () => await start.isEnabled(), {
        timeout: 5000,
        timeoutMsg: 'expected srat button to be enabled in 5s'
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
      });
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
      });


      const terminal = await $('#local-server-inf')
      await terminal.waitUntil(async function () {
        return (await terminal.getText()).includes('For help, type "help"')
      }, {
        timeout: 300000,
        timeoutMsg: 'expected local server to be available in 30s'
      });
    }


    // make sure to increase mochaOpts.timeout
    // await browser.debug()
  })
})
