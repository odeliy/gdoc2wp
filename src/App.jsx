import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import theme from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'
import { WindowHead } from './components/WindowHead'
import { WindowBody } from './components/WindowBody/WindowBody'
import formatGdoc from './formatter'
import { ActionMessage } from './components/ActionMessage'

const Container = styled.div`
  max-width: ${theme.width};
  margin-top: ${theme.gap.lg};
  background-color: ${theme.palette.blackStrong};
  box-shadow: ${theme.palette.blackStrong} 2px 5px 10px;
  border-radius: ${theme.roundedEdge};
`

const App = () => {
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('gdoc2html_settings')) || [
      {
        name: 'platform',
        togglePositionLeft: true,
        toggleLabels: ['WP', 'SB'],
        toggleValues: ['wordpress', 'storyblok'],
        description: 'CMS platform'
      },
      {
        name: 'website',
        togglePositionLeft: true,
        toggleLabels: ['BR', 'CC'],
        toggleValues: ['bankrate.com', 'creditcards.com'],
        description: 'Website for internal linking and table defaults'
      },
      {
        name: 'tableFormatting',
        togglePositionLeft: true,
        toggleLabels: ['ON', 'OFF'],
        toggleValues: [true, false],
        description: 'Change table structure and add default styling'
      }
    ]
  )

  const [messageStatus, setMessageStatus] = useState({
    isDisplayed: false,
    isSuccess: false,
    repeats: 0
  })

  useEffect(() => {
    localStorage.setItem('gdoc2html_settings', JSON.stringify(settings))
  }, [settings])

  window.addEventListener('paste', (event) => {
    let gdocText = event.clipboardData.getData('text/html')

    // check to see if gdocText is valid....

    if (gdocText) {
      // formatGdoc could be replaced with a call to server-side API
      let formattedHTML = formatGdoc(gdocText, settings)

      navigator.clipboard.writeText(formattedHTML).then(() => {
        setMessageStatus({
          isDisplayed: true,
          isSuccess: true,
          repeats: messageStatus.repeats + 1
        })
      })
    } else {
      setMessageStatus({
        isDisplayed: true,
        isSuccess: false,
        repeats: 0
      })
    }
  })

  function toggleSetting(name) {
    setSettings(
      settings.map((setting) => {
        if (setting.name === name) {
          return {
            ...setting,
            togglePositionLeft: !setting.togglePositionLeft
          }
        } else {
          return setting
        }
      })
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <WindowHead />
        <WindowBody settings={settings} toggleSetting={toggleSetting} />
      </Container>
      {messageStatus.isDisplayed && <ActionMessage messageStatus={messageStatus} />}
    </ThemeProvider>
  )
}

export default App
