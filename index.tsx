/* eslint-disable */
import React from 'react'
import { Dimensions, Platform, ViewStyle, View, Text } from 'react-native'
import { WebView, WebViewMessageEvent } from 'react-native-webview'

type Props = {
  style?: ViewStyle
  defaultValue?: string
  options?: any
  onChange: (html: string) => void
}

const Quill = (props: Props) => {
  const [loading, setLoading] = React.useState(true)
  const options = JSON.stringify({
    placeholder: '请输入...',
    modules: {
      toolbar: [[{ header: [1, 2, false] }], ['bold', 'italic', 'underline'], ['image', 'code-block']],
    },
    ...props.options,
    theme: 'snow',
  })
  const injectedJavaScriptBeforeContentLoaded = `window.options=${options}`
  const injectedJavaScript = `document.querySelector('#editor').children[0].innerHTML="${props.defaultValue}"`

  const onMessage = (e: WebViewMessageEvent) => {
    const data = JSON.parse(e.nativeEvent.data)
    if (data.type === 'onChange') {
      props.onChange(data.message)
    }
  }

  return (
    <>
    <WebView
      onLoadStart={() => {setLoading(true)}}
      onLoadEnd={() => {setLoading(false)}}
      onMessage={onMessage}
      source={Platform.OS === 'ios' ? require('../../ios/Assets/quill.html') : { uri: 'file:///android_asset/quill.html' }}
      javaScriptEnabled
      injectedJavaScriptBeforeContentLoaded={injectedJavaScriptBeforeContentLoaded}
      injectedJavaScript={injectedJavaScript}
      style={{ height: Dimensions.get('window').height - 42, width: Dimensions.get('window').width, ...props.style }}
    />
    {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}><Text>Loading Editor...</Text></View>}
    </>
  )
}

Quill.defaultProps = {
  style: {},
  defaultValue: '',
  options: {},
}

export default Quill
/* eslint-enable */
