import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Screen, Text } from "../../components"
import { BarCodeScanner } from "expo-barcode-scanner"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"

const ROOT: ViewStyle = {
  backgroundColor: color.transparent,
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}

const BARCODE_BOX: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  width: "auto",
  height: "auto",
  overflow: "hidden",
  flex: 1,
  borderRadius: 30,
}

// STOP! READ ME FIRST!
// To fix the TS error below, you'll need to add the following things in your navigation config:
// - Add `codebar: undefined` to NavigatorParamList
// - Import your screen, and add it to the stack:
//     `<Stack.Screen name="codebar" component={CodebarScreen} />`
// Hint: Look for the 🔥!

// REMOVE ME! ⬇️ This TS ignore will not be necessary after you've added the correct navigator param type
// @ts-ignore
export const CodebarScreen: FC<StackScreenProps<NavigatorParamList, "codebar">> = observer(
  function CodebarScreen() {
    // Pull in one of our MST stores
    // const { someStore, anotherStore } = useStores()
    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState("N'est pas encore scanné")

    useEffect(() => {
      ;(async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        setHasPermission(status === "granted")
      })()
    }, [])
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true)
      setText(data)
      alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>
    }
    // Pull in navigation via hook
    // const navigation = useNavigation()
    return (
      <Screen style={ROOT} preset="scroll">
        <Text preset="header" text="codebar" />
        <View style={BARCODE_BOX}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
          />
        </View>
        <Text style={{ fontSize: 24 }} text={text} />
        {scanned && <Button text={"Tap to Scan Again"} onPress={() => setScanned(false)} />}
      </Screen>
    )
  },
)
