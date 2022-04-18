import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, Modal, TouchableHighlight, Alert, TextStyle } from "react-native"
import { StackScreenProps } from "@react-navigation/stack"
import { NavigatorParamList } from "../../navigators"
import { Button, Screen, Text } from "../../components"
import { BarCodeScanner } from "expo-barcode-scanner"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import axios from "axios"

import { color } from "../../theme"
import { async, contains } from "validate.js"

const ROOT: ViewStyle = {
  backgroundColor: color.transparent,
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
}

const BARCODE_BOX: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  flex: 1,
  borderRadius: 30,
}

const centeredView: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 22,
}

const container: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "center",
}

const btnTap: ViewStyle = {
  position: "absolute",
  justifyContent: "center",
  width: "100%",
  height: "5%",
  backgroundColor: "blue",
  fontSize: 24,
}

const modalView: ViewStyle = {
  margin: 20,
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  backgroundColor: "white",
}

const modalText: TextStyle = {
  marginBottom: 15,
  textAlign: "center",
  fontSize: 18,
  fontWeight: "bold",
  color: "black",
}

const modalCancelText: TextStyle = { color: "white", fontWeight: "bold", textAlign: "center" }

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
    const [dataText, setDataText] = useState("")
    const [Msg, setMsg] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [colorStatus, setColorStatus] = useState("white")

    useEffect(() => {
      ;(async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync()
        setHasPermission(status === "granted")
      })()
    }, [])

    const barcodeFetchChecker = async () => {
      const repsonse = await axios.post(
        "https://api.casaticketing.ma/api/P6MXWJD9HRJ5VL1MESMU/barCodeScan",
        { barcode: dataText },
      )
    }

    const handleBarCodeScanned = async ({ type, data }) => {
      setScanned(true)
      setDataText(data)

      try {
        const response = await axios.post(
          "https://api.casaticketing.ma/api/P6MXWJD9HRJ5VL1MESMU/barCodeScan",
          { barcode: data },
        )
        const { message } = response.data
        setMsg("Ce billet est valide")
        console.log('Ce billet est valide"')
        setColorStatus("green")
        setModalVisible(true)
        //setScanned(false)
      } catch (err) {
        if (err.response.status === 404) {
          setScanned(true)
          setMsg("Ce billet n'existe pas")
          console.log("Ce billet n'existe pas")

          setColorStatus("red")
          setModalVisible(true)
        } else if (err.response.status === 403) {
          setScanned(true)
          setMsg("Ce billet à été scanné plusieurs fois")
          console.log("Ce billet à été scanné plusieurs fois")

          setColorStatus("orange")
          setModalVisible(true)
        }
      }

      //alert(`Bar code with type ${type} and data ${data} has been scanned!`)
    }

    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>
    }

    return (
      <View style={container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: "100%", width: "100%" }}
        />
        {scanned && (
          <Button
            textStyle={{ fontSize: 18 }}
            style={btnTap}
            text={"Scanner autre fois"}
            onPress={() => setScanned(false)}
          />
        )}

        <Modal
          animationType="fade"
          //animationInTiming = {13900}
          // transparent={true}

          visible={modalVisible}
          // animationOut = "slide"
        >
          <View style={centeredView}>
            <View
              style={{
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                backgroundColor: colorStatus,
              }}
            >
              <Text style={modalText}>
                {Msg} {dataText}
              </Text>

              <TouchableHighlight
                style={{ backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible)
                }}
              >
                <Text onPress={() => setModalVisible(false)} style={modalCancelText}>
                  Réessayer
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    )
  },
)
