import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TouchableOpacity, Platform, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
import NfcManager, { NfcEvents } from "react-native-nfc-manager"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.transparent,
  flex: 1,
}

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `rfid: undefined` to NavigatorParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="rfid" component={RfidScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore

export const RfidScreen: FC<StackScreenProps<NavigatorParamList, "rfid">> = observer(
  function RfidScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()

    // Pull in navigation via hook
    // const navigation = useNavigation()
    const [tagId, setTagId] = React.useState('')
    useEffect(() => {
      NfcManager.start()
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
        console.warn("tag", tag)
        setTagId(tag.id)
        NfcManager.setAlertMessage("I got your tag!")
        NfcManager.unregisterTagEvent().catch(() => 0)
      })
    }, [])

    async function _test() {
      try {
        await NfcManager.registerTagEvent()
      } catch (ex) {
        console.warn("ex", ex)
        NfcManager.unregisterTagEvent().catch(() => 0)
      }
    }

    async function _cancel() {
      NfcManager.unregisterTagEvent().catch(() => 0)
      setTagId('')
    }

    return (
      <Screen style={ROOT} preset="scroll">
        <View style={{ padding: 20 }}>
          <Text>NFC Demo</Text>
          <TouchableOpacity
            style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: "black" }}
            onPress={_test}
          >
            <Text style={{ fontSize: 24, color: "black" }}>Run a check</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ padding: 10, width: 200, margin: 20, borderWidth: 1, borderColor: "black" }}
            onPress={_cancel}
          >
            <Text style={{ fontSize: 24, color: "black" }}>Cancel Test</Text>
          </TouchableOpacity>

          <Text  style={{ fontSize: 24, color: "black" }}>NFC tag id is {tagId}</Text>
        </View>
      </Screen>
    )
  },
)