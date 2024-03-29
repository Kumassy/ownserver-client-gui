const path = require('path');

describe('Run Minecraft Game', () => {
  it('can publish local server', async () => {
    ////
    // Select Minecraft
    // verify minecraft is selected
    {
      const minecraft = await $('aria/Minecraft Java Edition')
      await expect(minecraft).toBePresent()

      await $('button*=Next').click()
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
      await browser.execute((server_jar_path) => {
        window.__TAURI_INVOKE__('tauri', {
          __tauriModule: 'Event',
          message: {
            cmd: 'emit',
            event: "tauri://file-drop",
            windowLabel: "main",
            payload: [server_jar_path]
          }
        })
      }, server_jar_path)

      $('aria/Accept EULA').click()

      const start = await $('button*=Start')
      await start.waitUntil(async () => await start.isEnabled(), {
        timeout: 5000,
        timeoutMsg: 'expected srat button to be enabled after 5s'
      });
      await start.click()

      const next = await $('button*=Next')
      await next.waitUntil(async () => await next.isEnabled(), {
        timeout: 15000,
        timeoutMsg: 'expected next button to be enabled after 60s'
      });
      await next.click()

    }

    ////
    // Configure ownserver
    //
    {
      const start = await $('button*=Start')
      await start.click()

      const next = await $('button*=Next')
      await next.waitUntil(async () => await next.isEnabled(), {
        timeout: 15000,
        timeoutMsg: 'expected next button to be enabled after 15s'
      });
      await next.click()
    }

    ////
    // Monitor
    //
    {
      const address = await $('p*=Your Public Address')
      await address.waitUntil(async function () {
        return (await address.getText()).includes('ownserver.kumassy.com')
      }, {
        timeout: 5000,
        timeoutMsg: 'expected public address to be available after 5s'
      });


      const terminal = await $('#local-server-inf')
      await terminal.waitUntil(async function () {
        return (await terminal.getText()).includes('For help, type "help"')
      }, {
        timeout: 300000,
        timeoutMsg: 'expected local server to be available after 30s'
      });
    }


    // make sure to increase mochaOpts.timeout
    // await browser.debug()
  })
})
