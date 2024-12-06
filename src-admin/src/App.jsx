// this file used only for simulation and not used in end build
import React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import { GenericApp, I18n, Loader, ConfigGeneric, AdminConnection } from '@iobroker/adapter-react-v5';

import ExampleComponent from './ExampleComponent';

const styles = {
    app: theme => ({
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        height: '100%',
    }),
    item: {
        padding: 50,
        width: 400,
    },
};

class App extends GenericApp {
    constructor(props) {
        const extendedProps = { ...props };
        extendedProps.Connection = AdminConnection;
        super(props, extendedProps);

        this.state = {
            data: { myCustomAttribute: 'red' },
            theme: this.createTheme(),
        };

        I18n.setLanguage((navigator.language || navigator.userLanguage || 'en').substring(0, 2).toLowerCase());
    }

    render() {
        if (!this.state.loaded) {
            return (
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={this.state.theme}>
                        <Loader themeType={this.state.themeType} />
                    </ThemeProvider>
                </StyledEngineProvider>
            );
        }

        return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={this.state.theme}>
                    <Box sx={styles.app}>
                        <div style={styles.item}>
                            <ExampleComponent
                                socket={this.socket}
                                themeType={this.state.themeType}
                                themeName={this.state.themeName}
                                attr="myCustomAttribute"
                                data={this.state.data}
                                onError={() => {}}
                                schema={{
                                    name: 'ConfigCustomTemplateSet/Components/ExampleComponent',
                                    type: 'custom',
                                }}
                                onChange={data => this.setState({ data })}
                            />
                        </div>
                    </Box>
                </ThemeProvider>
            </StyledEngineProvider>
        );
    }
}

export default withStyles(styles)(App);
