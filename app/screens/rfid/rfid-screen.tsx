import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TouchableOpacity, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Screen, Text } from "../../components"
import NfcManager, { NfcEvents } from "react-native-nfc-manager"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import axios from "axios"
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
    const [tagId, setTagId] = React.useState("")
    const [Msg, setMsg] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    useEffect(() => {
      NfcManager.start()
      NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag) => {
        //console.warn("tag", tag)
        setTagId(tag.id)
        try {
          console.log("goes through")

          const response = await axios.post(
            "http://192.168.1.181:3000/api/P6MXWJD9HRJ5VL1MESMU/rfidScan",
            { rfid: tag.id },
          )

          setMsg("Carte est valide")
          setLoading(true)

          console.log("response data is: ", response.data.ticket.zone)
        } catch (err) {
          if (err.response.status === 404) {
            setMsg("Carte n'est pas valide")
            setLoading(true)
          } else if (err.response.status === 403) {
            setMsg("Cette carte à été scanné plusieurs fois")
            setLoading(true)
          }
        }

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
      setLoading(false)
    }

    return (
      <Screen style={ROOT} preset="scroll">
        <View style={{ padding: 20 }}>
          <Text>NFC Demo</Text>
          <TouchableOpacity
            style={{
              padding: 10,
              width: 200,
              margin: 20,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "blue",
            }}
            onPress={_test}
          >
            <Text style={{ fontSize: 24, color: "white" }}>Scanner</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              width: 200,
              margin: 20,
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={_cancel}
          >
            <Text style={{ fontSize: 24, color: "black" }}>Réinitialiser</Text>
          </TouchableOpacity>
          <View style={{ padding: 10, margin: 16 }}>
            {loading ? (
              <Text style={{ fontSize: 24, color: "black", padding: 10 }}>
                Les informations du tag id is {tagId} {"\n"}
                L'état du billet est {Msg}
              </Text>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </Screen>
    )
  },
)
