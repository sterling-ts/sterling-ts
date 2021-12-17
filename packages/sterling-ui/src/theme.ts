import { extendTheme } from '@chakra-ui/react';
import { DashboardTheme } from './components/Dashboard/Dashboard';
import { DragBarTheme } from './components/Dashboard/DragBar';
import { DragHandleTheme } from './components/Dashboard/DragHandle';
import { LogListTheme } from './components/Log/LogList';
import { LogTextTheme } from './components/Log/LogText';
import { LogoTheme } from './components/Logo';
import { NavBarTheme } from './components/NavBar';
import { NavButtonTheme } from './components/NavButton';
import { PaneTheme } from './components/Dashboard/Pane';
import { SideBarTheme } from './components/SideBar';
import { SideBarButtonTheme } from './components/SideBarButton';
import { StatusBarTheme } from './components/StatusBar';
import { ViewTheme } from './components/View';

const sterlingTheme = extendTheme({
  fonts: {
    body: 'InterVariable',
    mono: 'Fira Code'
  },
  styles: {
    global: {
      'html, body, #root': {
        w: 'full',
        h: 'full',
        overflow: 'hidden'
      }
    }
  },
  components: {
    Dashboard: DashboardTheme,
    DragBar: DragBarTheme,
    DragHandle: DragHandleTheme,
    Logo: LogoTheme,
    LogList: LogListTheme,
    LogText: LogTextTheme,
    NavBar: NavBarTheme,
    NavButton: NavButtonTheme,
    Pane: PaneTheme,
    SideBar: SideBarTheme,
    SideBarButton: SideBarButtonTheme,
    StatusBar: StatusBarTheme,
    View: ViewTheme
  }
});

export { sterlingTheme };
