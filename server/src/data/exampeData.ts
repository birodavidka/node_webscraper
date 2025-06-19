export interface UsedCar {
  id: number;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  title: string;
  description: string;
  price: number;       // Ár euróban
  year: number;        // Gyártási év
  mileage: number;     // Futott kilométer
  transmission: string; // Váltó típusa (pl. Automata, Manuális)
  fuel: string;       // Üzemanyag típusa (pl. Benzin, Dízel)
}

export const usedCars =[
  {
    id:1,
    photo1: 'https://img.hasznaltautocdn.com/640x480/21837700/12659116.jpg',
    photo2: 'https://img.hasznaltautocdn.com/640x480/21837700/12659128.jpg',
    photo3: 'https://img.hasznaltautocdn.com/640x480/21837700/12659134.jpg',
    photo4: 'https://img.hasznaltautocdn.com/640x480/21837700/11433424.jpg',
    title: '2018 Honda Accord',
    description: 'A reliable and fuel-efficient sedan with a spacious interior.',
    price: 22000,
    year: 2018,
    mileage: 30000,
    transmission: 'Automatic',
    fuel: 'Benzin',
  },
  {
    id:2,
    photo1: 'https://img.hasznaltautocdn.com/640x480/21513318/8226273.jpg',
    photo2: 'https://img.hasznaltautocdn.com/640x480/21513318/8226282.jpg',
    photo3: 'https://img.hasznaltautocdn.com/640x480/21513318/8226287.jpg',
    photo4: 'https://img.hasznaltautocdn.com/640x480/21513318/8226291.jpg',
    title: '2014 Bmw 216i',
    description: 'A reliable and fuel-efficient sedan with a spacious interior.',
    price: 22000,
    year: 2018,
    mileage: 30000,
    transmission: 'Automatic',
    fuel: 'Benzin',
  },
]

// Példa típusdefiníció a használt autóalkatrészekhez
export interface UsedCarPart {
  id: number;
  name: string;
  description: string;
  price: number;       // Ár euróban
  imageUrl: string;    // Linkelt kép
}

// Maximum 10 rekordos példa tömb használt autóalkatrészekkel
export const usedCarParts: UsedCarPart[] = [
  {
    id: 1,
    name: 'Fékbetétek (Brake Pads)',
    description: 'Használt fékbetétek elöl-hátul, jó állapotban.',
    price: 45,
    imageUrl: 'https://s19526.pcdn.co/wp-content/uploads/2022/04/Brake-Pads.jpg'
  },
  {
    id: 2,
    name: 'Generátor (Alternator)',
    description: 'Működő generátor kisebb kopással.',
    price: 85,
    imageUrl: 'https://www.momentummotorworks.com/wp-content/uploads/2023/09/Mercedes-Alternator.jpg'
  },
  {
    id: 3,
    name: 'Hűtővíz-szivattyú (Water Pump)',
    description: 'Használt vízpumpa, tömítések cserélve.',
    price: 65,
    imageUrl: 'https://m.media-amazon.com/images/I/71pOV2yv5pL._UF894,1000_QL80_.jpg'
  },
  {
    id: 4,
    name: 'Első lámpa (Headlight)',
    description: 'Jobb oldali első lámpa, karcmentes üveg.',
    price: 55,
    imageUrl: 'https://i.ebayimg.com/images/g/RM0AAOSwwrRmUVfA/s-l1200.jpg'
  },
  {
    id: 5,
    name: 'Lengéscsillapító (Shock Absorber)',
    description: 'Hátsó lengéscsillapító pár, tesztelve.',
    price: 75,
    imageUrl: 'https://webshop.lineamotor.hu/img/63387/ES3512102/ES3512102.jpg'
  },
  {
    id: 6,
    name: 'Vezérműszíj (Timing Belt)',
    description: 'Cserélt vezérműszíj, minimális feszesség.',
    price: 35,
    imageUrl: 'https://media.rs-online.com/image/upload/bo_1.5px_solid_white,b_auto,c_pad,dpr_2,f_auto,h_399,q_auto,w_710/c_pad,h_399,w_710/R474942-01?pgw=1'
  },
  {
    id: 7,
    name: 'Kuplungtárcsa (Clutch Disc)',
    description: 'Félig kopott kuplungtárcsa, használható.',
    price: 50,
    imageUrl: 'https://cdn3.pelicanparts.com/graphics/catalog_2021/subcat/cat-clutch-flywheel.jpg'
  },
  {
    id: 8,
    name: 'Kipufogódob (Muffler)',
    description: 'Rozsdamentes acél kipufogódob, enyhe karcokkal.',
    price: 90,
    imageUrl: 'https://i.ebayimg.com/00/s/MTIwMFgxNjAw/z/D3oAAOSwgz9mC2bd/$_57.PNG?set_id=880000500F'
  },
  {
    id: 9,
    name: 'Indítómotor (Starter Motor)',
    description: 'Tesztelt, gyors indítás garantált.',
    price: 95,
    imageUrl: 'https://www.autohausaz.com/images/SR0827N.jpg'
  },
  {
    id: 10,
    name: 'Szélvédőmosó motor (Washer Pump)',
    description: 'Működő ablakmosó motor, tökéletes állapot.',
    price: 25,
    imageUrl: 'https://m.media-amazon.com/images/I/51WdxjV6SJL.jpg'
  }
];
