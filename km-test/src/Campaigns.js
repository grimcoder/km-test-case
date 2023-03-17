import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Toolbar } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './Campaigns.css';

dayjs.extend(customParseFormat);


const columns = [
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    width: 110,
    editable: true,
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    width: 110,
    editable: true,
  },

  {
    field: 'Budget',
    headerName: 'Budget',
    width: 110,
    editable: true,
  }
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);
const drawerWidth = 340;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

export default function CampaignsControl() {
  const MAX_DATE = '2099-12-31';
  const MIN_DATE = '1900-01-01';


  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [startValue, setStartValue] = React.useState(dayjs(MIN_DATE));
  const [endValue, setEndValue] = React.useState(dayjs(MAX_DATE));


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const filterEndDate = (date) => {return dayjs(date.endDate) <= endValue};

  const filterStartDate = (item) => {return  dayjs(item.startDate) >= startValue};

  const filterDate = (item) => {return  dayjs(item.startDate) <= dayjs(item.endDate)};

  const filterSearch = (item) => {return item.name.toLowerCase().includes(search.toLowerCase())};

  const [Campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    function handleAddCampaigns(evt) {
      setCampaigns(prevState => [...prevState, ...evt.detail])
    }

    window.addEventListener('AddCampaigns', handleAddCampaigns);
    return () => {
      window.removeEventListener('AddCampaigns', handleAddCampaigns);
    };
  }, []);

  return (
    <div className="Campaigns">

      <Box sx={{ height: 635, width: '100%' }}>

        <DataGrid
          rows={Campaigns.filter(filterSearch)
            .filter(filterStartDate)
            .filter(filterEndDate)
            .filter(filterDate)}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 9,
              },
            },
          }}
          pageSizeOptions={[9]}
          disableRowSelectionOnClick
        />

        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">

              Campaigns

            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main open={open}>

        </Main>

        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >

          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            Choose start and end date
          </DrawerHeader>

          <Divider />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <DatePicker
              inputProps={{ readOnly: true }}
              label="Start Date"
              value={startValue}
              maxDate={endValue}
              onChange={(newValue) => setStartValue(newValue)}
            />

            <div style={{ height: 20 }} />

            <DatePicker
              
              inputProps={{ readOnly: true }}
              label="End Date"
              minDate={startValue}
              value={endValue}
              onChange={(newValue) => setEndValue(newValue)}
            />

          </LocalizationProvider>

        </Drawer>

      </Box>
    </div>
  );
}