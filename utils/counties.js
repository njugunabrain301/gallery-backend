const countiesData = [
  {
    code: 1,
    name: "Mombasa",
    subcounties: ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  },
  {
    code: 2,
    name: "Kwale",
    subcounties: ["Matuga", "Lungalunga", "Kinango", "Msambweni"],
  },
  {
    code: 3,
    name: "Kilifi",
    subcounties: [
      "Malindi",
      "Kilifi North",
      "Kilifi South",
      "Ganze",
      "Magarini",
      "Rabai",
      "Kaloleni",
    ],
  },
  { code: 4, name: "Tana River", subcounties: ["Bura", "Galole", "Garsen"] },
  { code: 5, name: "Lamu", subcounties: ["Lamu West", "Lamu East"] },
  {
    code: 6,
    name: "Taita-Taveta",
    subcounties: ["Voi", "Mwatate", "Wundanyi", "Taveta"],
  },
  {
    code: 7,
    name: "Garissa",
    subcounties: [
      "Fafi",
      "Garissa",
      "Ijara",
      "Lagdera",
      "Dadaab",
      "Balambala",
      "Hulugho",
    ],
  },
  {
    code: 8,
    name: "Wajir",
    subcounties: [
      "Wajir East",
      "Wajir North",
      "Wajir South",
      "Tarbaj",
      "Eldas",
      "Wajir West",
    ],
  },
  {
    code: 9,
    name: "Mandera",
    subcounties: [
      "Lafey",
      "Banissa",
      "Mandera North",
      "Mandera South",
      "Mandera East",
      "Mandera West",
    ],
  },
  {
    code: 10,
    name: "Marsabit",
    subcounties: ["Saku", "North Horr", "Laisamis", "Moyale"],
  },
  { code: 11, name: "Isiolo", subcounties: ["Isiolo", "Merti", "Garbatulla"] },
  {
    code: 12,
    name: "Meru",
    subcounties: [
      "Igembe North",
      "Igembe Central",
      "Igembe South",
      "Tigania East",
      "Tigania West",
      "Buuri",
      "Imenti Central",
      "Imenti South",
      "Imenti North",
    ],
  },
  {
    code: 13,
    name: "Tharaka-Nithi",
    subcounties: [
      "IGAMBANG'OMBE",
      ,
      "MAARA",
      "MERU SOUTH",
      "THARAKA NORTH",
      "THARAKA SOUTH",
    ],
  },
  {
    code: 14,
    name: "Embu",
    subcounties: [
      "EMBU EAST",
      "EMBU NORTH",
      "EMBU WEST",
      "MBEERE SOUTH",
      "MBEERE NORTH",
    ],
  },
  {
    code: 15,
    name: "Kitui",
    subcounties: [
      "IKUTHA",
      "KATULANI",
      "KISASI",
      "KITUI CENTRAL",
      "KITUI WEST",
      "KYUSO",
      "LOWER YATTA",
      "MATINYANI",
      "MIGWANI",
      "MUMONI",
      "MUTITU",
      "MUTITU NORTH",
      "MUTOMO",
      "MWINGI CENTRAL",
      "MWINGI EAST",
      "NZAMBANI",
      "THAGICU",
      "TSEIKURU",
    ],
  },
  {
    code: 16,
    name: "Machakos",
    subcounties: [
      "ATHI RIVER",
      "KALAMA",
      "KANGUNDO",
      "KATHIANI",
      "MACHAKOS",
      "MASINGA",
      "MATUNGULU",
      "MWALA",
      "YATTA",
    ],
  },
  {
    code: 17,
    name: "Makueni",
    subcounties: [
      "KATHONZWENI",
      "KIBWEZI",
      "KILUNGU",
      "MAKINDU",
      "MAKUENI",
      "MBOONI EAST",
      "MBOONI WEST",
      "MUKAA",
      "NZAUI",
    ],
  },
  {
    code: 18,
    name: "Nyandarua",
    subcounties: [
      "KINANGOP",
      "NYANDARUA SOUTH",
      "MIRANGINE",
      "KIPIPIRI",
      "NYANDARUA CENTRAL",
      "NYANDARUA WEST",
      "NYANDARUA NORTH",
    ],
  },
  {
    code: 19,
    name: "Nyeri",
    subcounties: [
      "TETU",
      "KIENI EAST",
      "KIENI WEST",
      "MATHIRA EAST",
      "MATHIRA WEST",
      "NYERI SOUTH",
      "MUKURWE-INI",
      "NYERI CENTRAL",
    ],
  },
  {
    code: 20,
    name: "Kirinyaga",
    subcounties: [
      "KIRINYAGA CENTRAL",
      "KIRINYAGA EAST",
      "KIRINYAGA WEST",
      "MWEA EAST",
      "MWEA WEST",
    ],
  },
  {
    code: 21,
    name: "Murang'a",
    subcounties: [
      "MURANG'A EAST",
      "KANGEMA",
      "MATHIOYA",
      "KAHURO",
      "MURANG'A SOUTH",
      "GATANGA",
      "KIGUMO",
      "KANDARA",
    ],
  },
  {
    code: 22,
    name: "Kiambu",
    subcounties: [
      "GATUNDU NORTH",
      "GATUNDU SOUTH",
      "GITHUNGURI",
      "JUJA",
      "KABETE",
      "KIAMBAA",
      "KIAMBU",
      "KIKUYU",
      "LARI",
      "LIMURU",
      "RUIRU",
      "THIKA EAST",
      "THIKA WEST",
    ],
  },
  {
    code: 23,
    name: "Turkana",
    subcounties: [
      "KIBISH",
      "LOIMA",
      "TURKANA CENTRAL",
      "TURKANA EAST",
      "TURKANA NORTH",
      "TURKANA SOUTH",
      "TURKANA WEST",
    ],
  },
  {
    code: 24,
    name: "West Pokot",
    subcounties: [
      "KIPKOMO",
      "POKOT CENTRAL",
      "POKOT NORTH",
      "POKOT SOUTH",
      "WEST POKOT",
    ],
  },
  {
    code: 25,
    name: "Samburu",
    subcounties: ["SAMBURU CENTRAL", "SAMBURU EAST", "SAMBURU NORTH"],
  },
  {
    code: 26,
    name: "Trans-Nzoia",
    subcounties: [
      "TRANS NZOIA WEST",
      "TRANS NZOIA EAST",
      "KWANZA",
      "ENDEBESS",
      "KIMININI",
    ],
  },
  {
    code: 27,
    name: "Uasin Gishu",
    subcounties: ["AINABKOI", "KAPSERET", "KESSES", "MOIBEN", "SOY", "TURBO"],
  },
  {
    code: 28,
    name: "Elgeyo-Marakwet",
    subcounties: [
      "KEIYO NORTH",
      "KEIYO SOUTH",
      "MARAKWET EAST",
      "MARAKWET WEST",
    ],
  },
  {
    code: 29,
    name: "Nandi",
    subcounties: [
      "CHESUMEI",
      "NANDI CENTRAL",
      "NANDI EAST",
      "NANDI NORTH",
      "NANDI SOUTH",
      "TINDERET",
    ],
  },
  {
    code: 30,
    name: "Baringo",
    subcounties: [
      "BARINGO CENTRAL",
      "BARINGO NORTH",
      "EAST POKOT",
      "KOIBATEK",
      "MARIGAT",
      "MOGOTIO",
      "TIATY EAST",
      "LAKE BARINGO",
    ],
  },
  {
    code: 31,
    name: "Laikipia",
    subcounties: [
      "LAIKIPIA CENTRAL",
      "LAIKIPIA EAST",
      "LAIKIPIA NORTH",
      "LAIKIPIA WEST",
      "NYAHURURU",
    ],
  },
  {
    code: 32,
    name: "Nakuru",
    subcounties: [
      "GILGIL",
      "KURESOI NORTH",
      "KURESOI SOUTH",
      "MOLO",
      "NAIVASHA",
      "NAKURU EAST",
      "NAKURU NORTH",
      "NAKURU WEST",
      "NJORO",
      "RONGAI",
      "SUBUKIA",
      "CBD",
    ],
  },
  {
    code: 33,
    name: "Narok",
    subcounties: [
      "NAROK EAST",
      "NAROK NORTH",
      "NAROK SOUTH",
      "NAROK WEST",
      "TRANS MARA EAST",
      "TRANS MARA WEST",
    ],
  },
  {
    code: 34,
    name: "Kajiado",
    subcounties: [
      "ISINYA",
      "KAJIADO CENTRAL",
      "KAJIADO NORTH",
      "KAJIADO WEST",
      "LOITOKITOK",
      "MASHUURU",
    ],
  },
  {
    code: 35,
    name: "Kericho",
    subcounties: [
      "BELGUT",
      "BURETI",
      "KERICHO EAST",
      "KIPKELION",
      "LONDIANI",
      "SOIN SIGOWET",
    ],
  },
  {
    code: 36,
    name: "Bomet",
    subcounties: [
      "BOMET EAST",
      "CHEPALUNGU",
      "KONOIN",
      "SOTIK",
      "BOMET CENTRAL",
    ],
  },
  {
    code: 37,
    name: "Kakamega",
    subcounties: [
      "BUTERE",
      "KAKAMEGA CENTRAL",
      "KAKAMEGA EAST",
      "KAKAMEGA NORTH",
      "KAKAMEGA SOUTH",
      "KHWISERO",
      "LIKUYANI",
      "LUGARI",
      "MATETE",
      "MATUNGU",
      "MUMIAS EAST",
      "MUMIAS WEST",
      "NAVAKHOLO",
    ],
  },
  {
    code: 38,
    name: "Vihiga",
    subcounties: ["EMUHAYA", "VIHIGA", "SABATIA", "LUANDA", "HAMISI"],
  },
  {
    code: 39,
    name: "Bungoma",
    subcounties: [
      "BUMULA",
      "BUNGOMA CENTRAL",
      "BUNGOMA EAST",
      "BUNGOMA NORTH",
      "BUNGOMA SOUTH",
      "CHEPTAIS",
      "KIMILILI",
      "BUNGOMA WEST",
      "TONGAREN",
      "WEBUYE WEST",
      "MT ELGON FOREST",
    ],
  },
  {
    code: 40,
    name: "Busia",
    subcounties: [
      "BUNYALA",
      "BUSIA",
      "BUTULA",
      "NAMBALE",
      "SAMIA",
      "TESO NORTH",
      "TESO SOUTH",
    ],
  },
  {
    code: 41,
    name: "Siaya",
    subcounties: ["SIAYA", "GEM", "UGENYA", "UGUNJA", "BONDO", "RARIEDA"],
  },
  {
    code: 42,
    name: "Kisumu",
    subcounties: [
      "KISUMU EAST",
      "KISUMU CENTRAL",
      "KISUMU WEST",
      "SEME",
      "MUHORONI",
      "NYANDO",
      "NYAKACH",
    ],
  },
  {
    code: 43,
    name: "Homa Bay",
    subcounties: [
      "HOMA BAY",
      "NDHIWA",
      "RACHUONYO NORTH",
      "RACHUONYO EAST",
      "RACHUONYO SOUTH",
      "RANGWE",
      "SUBA NORTH",
      "SUBA SOUTH",
    ],
  },
  {
    code: 44,
    name: "Migori",
    subcounties: [
      "AWENDO",
      "KURIA EAST",
      "KURIA WEST",
      "NYATIKE",
      "RONGO",
      "SUNA EAST",
      "SUNA WEST",
      "URIRI",
    ],
  },
  {
    code: 45,
    name: "Kisii",
    subcounties: [
      "ETAGO",
      "GUCHA",
      "GUCHA SOUTH",
      "KENYENYA",
      "KISII CENTRAL",
      "KISII SOUTH",
      "KITUTU CENTRAL",
      "MARANI",
      "MASABA SOUTH",
      "NYAMACHE",
      "SAMETA",
    ],
  },
  {
    code: 46,
    name: "Nyamira",
    subcounties: [
      "BORABU",
      "MANGA",
      "MASABA NORTH",
      "NYAMIRA NORTH",
      "NYAMIRA SOUTH",
    ],
  },
  {
    code: 47,
    name: "Nairobi",
    subcounties: [
      "DAGORETTI",
      "EMBAKASI",
      "KAMUKUNJI",
      "KASARANI",
      "KIBRA",
      "LANG'ATA",
      "MAKADARA",
      "MATHARE",
      "NJIRU",
      "STAREHE",
      "WESTLANDS",
      "CBD",
    ],
  },
];

const listCounties = () => {
  let counties = countiesData.map((county) => county.name);
  return counties;
};

const counties = listCounties();

const getSubCounties = (county) => {
  let ct = countiesData.filter(
    (c) => c.name.toLowerCase() === county.toLowerCase()
  );
  if (ct && ct.length > 0) {
    let subcounties = ct[0].subcounties.map((sc) =>
      sc === "CBD"
        ? sc
        : sc.charAt(0).toUpperCase() + sc.slice(1, sc.length).toLowerCase()
    );
    return subcounties;
  } else {
    return [];
  }
};

const county_subcounties = () => {
  let list = [];
  countiesData.forEach((c) => {
    c.subcounties.forEach((s) => {
      list.push(
        c.name +
          " / " +
          (s === "CBD"
            ? s
            : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      );
    });
  });
  return list;
};

const county_subcounty = county_subcounties();

module.exports = { countiesData, counties, county_subcounty };
