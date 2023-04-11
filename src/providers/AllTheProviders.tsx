import React from 'react'
import { Provider } from "react-redux";
import { StatusBar, View, useColorScheme } from "react-native";
import { useFlipper } from "@react-navigation/devtools";
import { persistor, store } from "@store/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import FlipperAsyncStorage from "rn-flipper-async-storage-advanced";
import { CombinedDarkTheme, CombinedDefaultTheme } from '@src/theme';
import { Provider as PaperProvider, Text } from "react-native-paper";
import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message';
import {
    NavigationContainer,
    useNavigationContainerRef,
} from "@react-navigation/native";
import FullScreenActivityIndicator from '@components/FullScreenActivityIndicator';


const toastConfig: ToastConfig = {
    /*
    Or create a completely new type - `twitter`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
    twitter: (props) => (
        <BaseToast
            {...props}
            text1Style={{ color: CombinedDefaultTheme.colors.white, fontWeight: "500" }}
            text2Style={{ color: CombinedDefaultTheme.colors.white, fontWeight: "500" }}
            style={{ width: "90%", backgroundColor: CombinedDefaultTheme.colors.primary, borderLeftColor: CombinedDefaultTheme.colors.primary, shadowColor: "transparent", height: 40 }}
        />
    )
};


function AllTheProviders({ children }: React.PropsWithChildren) {
    const scheme = useColorScheme();
    const navigationRef = useNavigationContainerRef();

    useFlipper(navigationRef);

    return (
        <PaperProvider
            theme={scheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}>
            <PersistGate
                persistor={persistor}
                loading={<FullScreenActivityIndicator />}
            >
                <StatusBar backgroundColor={CombinedDefaultTheme.colors.white} barStyle={"dark-content"} />
                <Provider store={store}>
                    <FlipperAsyncStorage />


                    <NavigationContainer ref={navigationRef} theme={scheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme}>
                        {children}
                    </NavigationContainer>
                    <Toast config={toastConfig} position='bottom' />
                </Provider>
            </PersistGate>
        </PaperProvider>

    )
}

export default AllTheProviders