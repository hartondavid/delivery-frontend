
import { RIGHTS_MAPPING } from './utilConstants';
import TocIcon from '@mui/icons-material/Toc';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import RouteIcon from '@mui/icons-material/Route';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ErrorIcon from '@mui/icons-material/Error';

export const menus = [

    {
        id: 1,
        parentId: null,
        name: "Comenzi",
        to: "/dashboard/orders",
        icon: TocIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.ADMIN, RIGHTS_MAPPING.COURIER],
        order: 90,
        children: [

        ]
    },

    {
        id: 2,
        parentId: null,
        name: "Livrari",
        to: "/dashboard/deliveries",
        icon: DeliveryDiningIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.ADMIN, RIGHTS_MAPPING.COURIER],
        order: 90,
        children: [

        ]
    },
    {
        id: 3,
        parentId: null,
        name: "Rute",
        to: "/dashboard/routes",
        icon: RouteIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.ADMIN, RIGHTS_MAPPING.COURIER],
        order: 90,
        children: [

        ]
    },
    {
        id: 4,
        parentId: null,
        name: "Curieri",
        to: "/dashboard/couriers",
        icon: PeopleAltIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.ADMIN],
        order: 90,
        children: [

        ]
    },
    {
        id: 5,
        parentId: null,
        name: "Probleme",
        to: "/dashboard/issues",
        icon: ErrorIcon,
        isCategory: false,
        excludelocationsType: [],
        rights: [RIGHTS_MAPPING.ADMIN, RIGHTS_MAPPING.COURIER],
        order: 90,
        children: [

        ]
    },



]
