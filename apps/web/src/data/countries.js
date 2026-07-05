const countryList = [
  {
    id: "1",
    version: "",
    countryCode: "1",
    countryName: "Armenia",
    shortName: "Armenia",
    isoa2: "AM",
    score: "3A"
  },
  {
    id: "2",
    version: "",
    countryCode: "2",
    countryName: "Afghanistan",
    shortName: "Afghanistan",
    isoa2: "AF",
    score: "3A"
  },
  {
    id: "3",
    version: "",
    countryCode: "3",
    countryName: "Albania",
    shortName: "Albania",
    isoa2: "AL",
    score: "3A"
  },
  {
    id: "4",
    version: "",
    countryCode: "4",
    countryName: "Algeria",
    shortName: "Algeria",
    isoa2: "DZ",
    score: "2A"
  },
  {
    id: "5",
    version: "",
    countryCode: "7",
    countryName: "Angola",
    shortName: "Angola",
    isoa2: "AO",
    score: "3A"
  },
  {
    id: "6",
    version: "",
    countryCode: "8",
    countryName: "Antigua and Barbuda",
    shortName: "Antigua and Barbuda",
    isoa2: "AG",
    score: "2B"
  },
  {
    id: "7",
    version: "",
    countryCode: "9",
    countryName: "Argentina",
    shortName: "Argentina",
    isoa2: "AR",
    score: "3A"
  },
  {
    id: "8",
    version: "",
    countryCode: "10",
    countryName: "Australia",
    shortName: "Australia",
    isoa2: "AU",
    score: "3A"
  },
  {
    id: "9",
    version: "",
    countryCode: "11",
    countryName: "Austria",
    shortName: "Austria",
    isoa2: "AT",
    score: "3A"
  },
  {
    id: "10",
    version: "",
    countryCode: "12",
    countryName: "Bahamas",
    shortName: "Bahamas",
    isoa2: "BS",
    score: "3A"
  },
  {
    id: "11",
    version: "",
    countryCode: "13",
    countryName: "Bahrain",
    shortName: "Bahrain",
    isoa2: "BH",
    score: "3A"
  },
  {
    id: "12",
    version: "",
    countryCode: "14",
    countryName: "Barbados",
    shortName: "Barbados",
    isoa2: "BB",
    score: "3A"
  },
  {
    id: "13",
    version: "",
    countryCode: "16",
    countryName: "Bangladesh",
    shortName: "Bangladesh",
    isoa2: "BD",
    score: "3A"
  },
  {
    id: "14",
    version: "",
    countryCode: "17",
    countryName: "Bermuda",
    shortName: "Bermuda",
    isoa2: "BM",
    score: "2B"
  },
  {
    id: "15",
    version: "",
    countryCode: "18",
    countryName: "Bhutan",
    shortName: "Bhutan",
    isoa2: "BT",
    score: "3A"
  },
  {
    id: "16",
    version: "",
    countryCode: "19",
    countryName: "Bolivia",
    shortName: "Bolivia",
    isoa2: "BO",
    score: "3A"
  },
  {
    id: "17",
    version: "",
    countryCode: "20",
    countryName: "Botswana",
    shortName: "Botswana",
    isoa2: "BW",
    score: "3A"
  },
  {
    id: "18",
    version: "",
    countryCode: "21",
    countryName: "Brazil",
    shortName: "Brazil",
    isoa2: "BR",
    score: "3A"
  },
  {
    id: "19",
    version: "",
    countryCode: "22",
    countryName: "Aruba",
    shortName: "Aruba",
    isoa2: "AW",
    score: "2B"
  },
  {
    id: "20",
    version: "",
    countryCode: "23",
    countryName: "Belize",
    shortName: "Belize",
    isoa2: "BZ",
    score: "1A"
  },
  {
    id: "21",
    version: "",
    countryCode: "25",
    countryName: "Solomon Islands",
    shortName: "Solomon Islands",
    isoa2: "SB",
    score: "1A"
  },
  {
    id: "22",
    version: "",
    countryCode: "26",
    countryName: "Brunei Darussalam",
    shortName: "Brunei",
    isoa2: "BN",
    score: "3A"
  },
  {
    id: "23",
    version: "",
    countryCode: "27",
    countryName: "Bulgaria",
    shortName: "Bulgaria",
    isoa2: "BG",
    score: "2A"
  },
  {
    id: "24",
    version: "",
    countryCode: "28",
    countryName: "Myanmar",
    shortName: "Myanmar",
    isoa2: "MM",
    score: "3A"
  },
  {
    id: "25",
    version: "",
    countryCode: "29",
    countryName: "Burundi",
    shortName: "Burundi",
    isoa2: "BI",
    score: "3A"
  },
  {
    id: "26",
    version: "",
    countryCode: "32",
    countryName: "Cameroon",
    shortName: "Cameroon",
    isoa2: "CM",
    score: "3A"
  },
  {
    id: "27",
    version: "",
    countryCode: "33",
    countryName: "Canada",
    shortName: "Canada",
    isoa2: "CA",
    score: "3A"
  },
  {
    id: "28",
    version: "",
    countryCode: "35",
    countryName: "Cabo Verde",
    shortName: "Cabo Verde",
    isoa2: "CV",
    score: "2B"
  },
  {
    id: "29",
    version: "",
    countryCode: "36",
    countryName: "Cayman Islands",
    shortName: "Cayman Islands",
    isoa2: "KY",
    score: "2B"
  },
  {
    id: "30",
    version: "",
    countryCode: "37",
    countryName: "Central African Republic",
    shortName: "Central African Republic",
    isoa2: "CF",
    score: "3A"
  },
  {
    id: "31",
    version: "",
    countryCode: "38",
    countryName: "Sri Lanka",
    shortName: "Sri Lanka",
    isoa2: "LK",
    score: "3A"
  },
  {
    id: "32",
    version: "",
    countryCode: "39",
    countryName: "Chad",
    shortName: "Chad",
    isoa2: "TD",
    score: "3A"
  },
  {
    id: "33",
    version: "",
    countryCode: "40",
    countryName: "Chile",
    shortName: "Chile",
    isoa2: "CL",
    score: "3A"
  },
  {
    id: "34",
    version: "",
    countryCode: "44",
    countryName: "Colombia",
    shortName: "Colombia",
    isoa2: "CO",
    score: "3A"
  },
  {
    id: "35",
    version: "",
    countryCode: "45",
    countryName: "Comoros",
    shortName: "Comoros",
    isoa2: "KM",
    score: "2B"
  },
  {
    id: "36",
    version: "",
    countryCode: "46",
    countryName: "Congo",
    shortName: "Congo",
    isoa2: "CG",
    score: "3A"
  },
  {
    id: "37",
    version: "",
    countryCode: "47",
    countryName: "Cook Islands",
    shortName: "Cook Islands",
    isoa2: "CK",
    score: "1B"
  },
  {
    id: "38",
    version: "",
    countryCode: "48",
    countryName: "Costa Rica",
    shortName: "Costa Rica",
    isoa2: "CR",
    score: "3A"
  },
  {
    id: "39",
    version: "",
    countryCode: "49",
    countryName: "Cuba",
    shortName: "Cuba",
    isoa2: "CU",
    score: "3A"
  },
  {
    id: "40",
    version: "",
    countryCode: "50",
    countryName: "Cyprus",
    shortName: "Cyprus",
    isoa2: "CY",
    score: "2B"
  },
  {
    id: "41",
    version: "",
    countryCode: "51",
    countryName: "Czechoslovakia",
    shortName: "Czechoslovakia",
    isoa2: "",
    score: "2B"
  },
  {
    id: "42",
    version: "",
    countryCode: "52",
    countryName: "Azerbaijan",
    shortName: "Azerbaijan",
    isoa2: "AZ",
    score: "3A"
  },
  {
    id: "43",
    version: "",
    countryCode: "53",
    countryName: "Benin",
    shortName: "Benin",
    isoa2: "BJ",
    score: "3A"
  },
  {
    id: "44",
    version: "",
    countryCode: "54",
    countryName: "Denmark",
    shortName: "Denmark",
    isoa2: "DK",
    score: "3A"
  },
  {
    id: "45",
    version: "",
    countryCode: "55",
    countryName: "Dominica",
    shortName: "Dominica",
    isoa2: "DM",
    score: "2B"
  },
  {
    id: "46",
    version: "",
    countryCode: "56",
    countryName: "Dominican Republic",
    shortName: "Dominican Republic",
    isoa2: "DO",
    score: "3A"
  },
  {
    id: "47",
    version: "",
    countryCode: "57",
    countryName: "Belarus",
    shortName: "Belarus",
    isoa2: "BY",
    score: "3A"
  },
  {
    id: "48",
    version: "",
    countryCode: "58",
    countryName: "Ecuador",
    shortName: "Ecuador",
    isoa2: "EC",
    score: "2B"
  },
  {
    id: "49",
    version: "",
    countryCode: "59",
    countryName: "Egypt",
    shortName: "Egypt",
    isoa2: "EG",
    score: "2B"
  },
  {
    id: "50",
    version: "",
    countryCode: "60",
    countryName: "El Salvador",
    shortName: "El Salvador",
    isoa2: "SV",
    score: "3A"
  },
  {
    id: "51",
    version: "",
    countryCode: "61",
    countryName: "Equatorial Guinea",
    shortName: "Equatorial Guinea",
    isoa2: "GQ",
    score: "2A"
  },
  {
    id: "52",
    version: "",
    countryCode: "62",
    countryName: "Ethiopia PDR",
    shortName: "Ethiopia PDR",
    isoa2: "",
    score: "3A"
  },
  {
    id: "53",
    version: "",
    countryCode: "63",
    countryName: "Estonia",
    shortName: "Estonia",
    isoa2: "EE",
    score: "3A"
  },
  {
    id: "54",
    version: "",
    countryCode: "66",
    countryName: "Fiji",
    shortName: "Fiji",
    isoa2: "FJ",
    score: "3A"
  },
  {
    id: "55",
    version: "",
    countryCode: "67",
    countryName: "Finland",
    shortName: "Finland",
    isoa2: "FI",
    score: "2A"
  },
  {
    id: "56",
    version: "",
    countryCode: "68",
    countryName: "France",
    shortName: "France",
    isoa2: "FR",
    score: "3A"
  },
  {
    id: "57",
    version: "",
    countryCode: "69",
    countryName: "French Guiana",
    shortName: "French Guiana",
    isoa2: "GF",
    score: "2A"
  },
  {
    id: "58",
    version: "",
    countryCode: "70",
    countryName: "French Polynesia",
    shortName: "French Polynesia",
    isoa2: "PF",
    score: "2B"
  },
  {
    id: "59",
    version: "",
    countryCode: "72",
    countryName: "Djibouti",
    shortName: "Djibouti",
    isoa2: "DJ",
    score: "2A"
  },
  {
    id: "60",
    version: "",
    countryCode: "73",
    countryName: "Georgia",
    shortName: "Georgia",
    isoa2: "GE",
    score: "2A"
  },
  {
    id: "61",
    version: "",
    countryCode: "74",
    countryName: "Gabon",
    shortName: "Gabon",
    isoa2: "GA",
    score: "2A"
  },
  {
    id: "62",
    version: "",
    countryCode: "75",
    countryName: "Gambia",
    shortName: "Gambia",
    isoa2: "GM",
    score: "3A"
  },
  {
    id: "63",
    version: "",
    countryCode: "79",
    countryName: "Germany",
    shortName: "Germany",
    isoa2: "DE",
    score: "3A"
  },
  {
    id: "64",
    version: "",
    countryCode: "80",
    countryName: "Bosnia and Herzegovina",
    shortName: "Bosnia and Herzegovina",
    isoa2: "BA",
    score: "3A"
  },
  {
    id: "65",
    version: "",
    countryCode: "81",
    countryName: "Ghana",
    shortName: "Ghana",
    isoa2: "GH",
    score: "3A"
  },
  {
    id: "66",
    version: "",
    countryCode: "84",
    countryName: "Greece",
    shortName: "Greece",
    isoa2: "GR",
    score: "3A"
  },
  {
    id: "67",
    version: "",
    countryCode: "86",
    countryName: "Grenada",
    shortName: "Grenada",
    isoa2: "GD",
    score: "2B"
  },
  {
    id: "68",
    version: "",
    countryCode: "87",
    countryName: "Guadeloupe",
    shortName: "Guadeloupe",
    isoa2: "GP",
    score: "3A"
  },
  {
    id: "69",
    version: "",
    countryCode: "89",
    countryName: "Guatemala",
    shortName: "Guatemala",
    isoa2: "GT",
    score: "2A"
  },
  {
    id: "70",
    version: "",
    countryCode: "90",
    countryName: "Guinea",
    shortName: "Guinea",
    isoa2: "GN",
    score: "3A"
  },
  {
    id: "71",
    version: "",
    countryCode: "91",
    countryName: "Guyana",
    shortName: "Guyana",
    isoa2: "GY",
    score: "3A"
  },
  {
    id: "72",
    version: "",
    countryCode: "93",
    countryName: "Haiti",
    shortName: "Haiti",
    isoa2: "HT",
    score: "3A"
  },
  {
    id: "73",
    version: "",
    countryCode: "95",
    countryName: "Honduras",
    shortName: "Honduras",
    isoa2: "HN",
    score: "2B"
  },
  {
    id: "74",
    version: "",
    countryCode: "97",
    countryName: "Hungary",
    shortName: "Hungary",
    isoa2: "HU",
    score: "2A"
  },
  {
    id: "75",
    version: "",
    countryCode: "98",
    countryName: "Croatia",
    shortName: "Croatia",
    isoa2: "HR",
    score: "3A"
  },
  {
    id: "76",
    version: "",
    countryCode: "100",
    countryName: "India",
    shortName: "India",
    isoa2: "IN",
    score: "3A"
  },
  {
    id: "77",
    version: "",
    countryCode: "101",
    countryName: "Indonesia",
    shortName: "Indonesia",
    isoa2: "ID",
    score: "3A"
  },
  {
    id: "78",
    version: "",
    countryCode: "102",
    countryName: "Iran, Islamic Republic of",
    shortName: "Iran",
    isoa2: "IR",
    score: "2A"
  },
  {
    id: "79",
    version: "",
    countryCode: "103",
    countryName: "Iraq",
    shortName: "Iraq",
    isoa2: "IQ",
    score: "2A"
  },
  {
    id: "80",
    version: "",
    countryCode: "104",
    countryName: "Ireland",
    shortName: "Ireland",
    isoa2: "IE",
    score: "2A"
  },
  {
    id: "81",
    version: "",
    countryCode: "105",
    countryName: "Israel",
    shortName: "Israel",
    isoa2: "IL",
    score: "3A"
  },
  {
    id: "82",
    version: "",
    countryCode: "106",
    countryName: "Italy",
    shortName: "Italy",
    isoa2: "IT",
    score: "3A"
  },
  {
    id: "83",
    version: "",
    countryCode: "107",
    countryName: "Côte d'Ivoire",
    shortName: "Cote d'Ivoire",
    isoa2: "CI",
    score: "3A"
  },
  {
    id: "84",
    version: "",
    countryCode: "108",
    countryName: "Kazakhstan",
    shortName: "Kazakhstan",
    isoa2: "KZ",
    score: "3A"
  },
  {
    id: "85",
    version: "",
    countryCode: "109",
    countryName: "Jamaica",
    shortName: "Jamaica",
    isoa2: "JM",
    score: "2A"
  },
  {
    id: "86",
    version: "",
    countryCode: "110",
    countryName: "Japan",
    shortName: "Japan",
    isoa2: "JP",
    score: "3A"
  },
  {
    id: "87",
    version: "",
    countryCode: "112",
    countryName: "Jordan",
    shortName: "Jordan",
    isoa2: "JO",
    score: "3A"
  },
  {
    id: "88",
    version: "",
    countryCode: "113",
    countryName: "Kyrgyzstan",
    shortName: "Kyrgyzstan",
    isoa2: "KG",
    score: "2A"
  },
  {
    id: "89",
    version: "",
    countryCode: "114",
    countryName: "Kenya",
    shortName: "Kenya",
    isoa2: "KE",
    score: "3A"
  },
  {
    id: "90",
    version: "",
    countryCode: "115",
    countryName: "Cambodia",
    shortName: "Cambodia",
    isoa2: "KH",
    score: "2B"
  },
  {
    id: "91",
    version: "",
    countryCode: "116",
    countryName: "Korea, Democratic People's Republic of",
    shortName: "North Korea",
    isoa2: "KP",
    score: "3A"
  },
  {
    id: "92",
    version: "",
    countryCode: "117",
    countryName: "Korea, Republic of",
    shortName: "South Korea",
    isoa2: "KR",
    score: "3A"
  },
  {
    id: "93",
    version: "",
    countryCode: "118",
    countryName: "Kuwait",
    shortName: "Kuwait",
    isoa2: "KW",
    score: "3A"
  },
  {
    id: "94",
    version: "",
    countryCode: "119",
    countryName: "Latvia",
    shortName: "Latvia",
    isoa2: "LV",
    score: "3A"
  },
  {
    id: "95",
    version: "",
    countryCode: "120",
    countryName: "Lao People's Democratic Republic",
    shortName: "Laos",
    isoa2: "LA",
    score: "3A"
  },
  {
    id: "96",
    version: "",
    countryCode: "121",
    countryName: "Lebanon",
    shortName: "Lebanon",
    isoa2: "LB",
    score: "3A"
  },
  {
    id: "97",
    version: "",
    countryCode: "122",
    countryName: "Lesotho",
    shortName: "Lesotho",
    isoa2: "LS",
    score: "3A"
  },
  {
    id: "98",
    version: "",
    countryCode: "123",
    countryName: "Liberia",
    shortName: "Liberia",
    isoa2: "LR",
    score: "2A"
  },
  {
    id: "99",
    version: "",
    countryCode: "124",
    countryName: "Libyan Arab Jamahiriya",
    shortName: "Libya",
    isoa2: "LY",
    score: "3A"
  },
  {
    id: "100",
    version: "",
    countryCode: "126",
    countryName: "Lithuania",
    shortName: "Lithuania",
    isoa2: "LT",
    score: "3A"
  },
  {
    id: "101",
    version: "",
    countryCode: "129",
    countryName: "Madagascar",
    shortName: "Madagascar",
    isoa2: "MG",
    score: "3A"
  },
  {
    id: "102",
    version: "",
    countryCode: "130",
    countryName: "Malawi",
    shortName: "Malawi",
    isoa2: "MW",
    score: "3A"
  },
  {
    id: "103",
    version: "",
    countryCode: "131",
    countryName: "Malaysia",
    shortName: "Malaysia",
    isoa2: "MY",
    score: "3A"
  },
  {
    id: "104",
    version: "",
    countryCode: "133",
    countryName: "Mali",
    shortName: "Mali",
    isoa2: "ML",
    score: "3A"
  },
  {
    id: "105",
    version: "",
    countryCode: "134",
    countryName: "Malta",
    shortName: "Malta",
    isoa2: "MT",
    score: "2B"
  },
  {
    id: "106",
    version: "",
    countryCode: "135",
    countryName: "Martinique",
    shortName: "Martinique",
    isoa2: "MQ",
    score: "2B"
  },
  {
    id: "107",
    version: "",
    countryCode: "136",
    countryName: "Mauritania",
    shortName: "Mauritania",
    isoa2: "MR",
    score: "2A"
  },
  {
    id: "108",
    version: "",
    countryCode: "137",
    countryName: "Mauritius",
    shortName: "Mauritius",
    isoa2: "MU",
    score: "2B"
  },
  {
    id: "109",
    version: "",
    countryCode: "138",
    countryName: "Mexico",
    shortName: "Mexico",
    isoa2: "MX",
    score: "3A"
  },
  {
    id: "110",
    version: "",
    countryCode: "141",
    countryName: "Mongolia",
    shortName: "Mongolia",
    isoa2: "MN",
    score: "2A"
  },
  {
    id: "111",
    version: "",
    countryCode: "142",
    countryName: "Montserrat",
    shortName: "Montserrat",
    isoa2: "MS",
    score: "1B"
  },
  {
    id: "112",
    version: "",
    countryCode: "143",
    countryName: "Morocco",
    shortName: "Morocco",
    isoa2: "MA",
    score: "2A"
  },
  {
    id: "113",
    version: "",
    countryCode: "144",
    countryName: "Mozambique",
    shortName: "Mozambique",
    isoa2: "MZ",
    score: "3A"
  },
  {
    id: "114",
    version: "",
    countryCode: "146",
    countryName: "Moldova",
    shortName: "Moldova",
    isoa2: "MD",
    score: "3A"
  },
  {
    id: "115",
    version: "",
    countryCode: "147",
    countryName: "Namibia",
    shortName: "Namibia",
    isoa2: "NA",
    score: "2A"
  },
  {
    id: "116",
    version: "",
    countryCode: "149",
    countryName: "Nepal",
    shortName: "Nepal",
    isoa2: "NP",
    score: "3A"
  },
  {
    id: "117",
    version: "",
    countryCode: "150",
    countryName: "Netherlands",
    shortName: "Netherlands",
    isoa2: "NL",
    score: "3A"
  },
  {
    id: "118",
    version: "",
    countryCode: "154",
    countryName: "Macedonia TFYR",
    shortName: "Macedonia",
    isoa2: "MK",
    score: "3A"
  },
  {
    id: "119",
    version: "",
    countryCode: "156",
    countryName: "New Zealand",
    shortName: "New Zealand",
    isoa2: "NZ",
    score: "2B"
  },
  {
    id: "120",
    version: "",
    countryCode: "157",
    countryName: "Nicaragua",
    shortName: "Nicaragua",
    isoa2: "NI",
    score: "3A"
  },
  {
    id: "121",
    version: "",
    countryCode: "158",
    countryName: "Niger",
    shortName: "Niger",
    isoa2: "NE",
    score: "3A"
  },
  {
    id: "122",
    version: "",
    countryCode: "159",
    countryName: "Nigeria",
    shortName: "Nigeria",
    isoa2: "NG",
    score: "3A"
  },
  {
    id: "123",
    version: "",
    countryCode: "162",
    countryName: "Norway",
    shortName: "Norway",
    isoa2: "NO",
    score: "3A"
  },
  {
    id: "124",
    version: "",
    countryCode: "165",
    countryName: "Pakistan",
    shortName: "Pakistan",
    isoa2: "PK",
    score: "3A"
  },
  {
    id: "125",
    version: "",
    countryCode: "166",
    countryName: "Panama",
    shortName: "Panama",
    isoa2: "PA",
    score: "3A"
  },
  {
    id: "126",
    version: "",
    countryCode: "167",
    countryName: "Czech Republic",
    shortName: "Czech Republic",
    isoa2: "CZ",
    score: "3A"
  },
  {
    id: "127",
    version: "",
    countryCode: "168",
    countryName: "Papua New Guinea",
    shortName: "Papua New Guinea",
    isoa2: "PG",
    score: "2A"
  },
  {
    id: "128",
    version: "",
    countryCode: "169",
    countryName: "Paraguay",
    shortName: "Paraguay",
    isoa2: "PY",
    score: "3A"
  },
  {
    id: "129",
    version: "",
    countryCode: "170",
    countryName: "Peru",
    shortName: "Peru",
    isoa2: "PE",
    score: "3A"
  },
  {
    id: "130",
    version: "",
    countryCode: "171",
    countryName: "Philippines",
    shortName: "Philippines",
    isoa2: "PH",
    score: "3A"
  },
  {
    id: "131",
    version: "",
    countryCode: "173",
    countryName: "Poland",
    shortName: "Poland",
    isoa2: "PL",
    score: "3A"
  },
  {
    id: "132",
    version: "",
    countryCode: "174",
    countryName: "Portugal",
    shortName: "Portugal",
    isoa2: "PT",
    score: "3A"
  },
  {
    id: "133",
    version: "",
    countryCode: "175",
    countryName: "Guinea-Bissau",
    shortName: "Guinea-Bissau",
    isoa2: "GW",
    score: "3A"
  },
  {
    id: "134",
    version: "",
    countryCode: "176",
    countryName: "Timor-Leste",
    shortName: "Timor-Leste",
    isoa2: "TL",
    score: "2A"
  },
  {
    id: "135",
    version: "",
    countryCode: "178",
    countryName: "Eritrea",
    shortName: "Eritrea",
    isoa2: "ER",
    score: "3A"
  },
  {
    id: "136",
    version: "",
    countryCode: "179",
    countryName: "Qatar",
    shortName: "Qatar",
    isoa2: "QA",
    score: "3A"
  },
  {
    id: "137",
    version: "",
    countryCode: "181",
    countryName: "Zimbabwe",
    shortName: "Zimbabwe",
    isoa2: "ZW",
    score: "3A"
  },
  {
    id: "138",
    version: "",
    countryCode: "182",
    countryName: "Réunion",
    shortName: "Reunion",
    isoa2: "RE",
    score: "2B"
  },
  {
    id: "139",
    version: "",
    countryCode: "183",
    countryName: "Romania",
    shortName: "Romania",
    isoa2: "RO",
    score: "3A"
  },
  {
    id: "140",
    version: "",
    countryCode: "184",
    countryName: "Rwanda",
    shortName: "Rwanda",
    isoa2: "RW",
    score: "3A"
  },
  {
    id: "141",
    version: "",
    countryCode: "185",
    countryName: "Russian Federation",
    shortName: "Russia",
    isoa2: "RU",
    score: "3A"
  },
  {
    id: "142",
    version: "",
    countryCode: "186",
    countryName: "Serbia and Montenegro",
    shortName: "Serbia and Montenegro",
    isoa2: "CS",
    score: "3A"
  },
  {
    id: "143",
    version: "",
    countryCode: "189",
    countryName: "Saint Lucia",
    shortName: "St. Lucia",
    isoa2: "LC",
    score: "3A"
  },
  {
    id: "144",
    version: "",
    countryCode: "193",
    countryName: "Sao Tome and Principe",
    shortName: "Sao Tome and Principe",
    isoa2: "ST",
    score: "2B"
  },
  {
    id: "145",
    version: "",
    countryCode: "194",
    countryName: "Saudi Arabia",
    shortName: "Saudi Arabia",
    isoa2: "SA",
    score: "3A"
  },
  {
    id: "146",
    version: "",
    countryCode: "195",
    countryName: "Senegal",
    shortName: "Senegal",
    isoa2: "SN",
    score: "2A"
  },
  {
    id: "147",
    version: "",
    countryCode: "197",
    countryName: "Sierra Leone",
    shortName: "Sierra Leone",
    isoa2: "SL",
    score: "3A"
  },
  {
    id: "148",
    version: "",
    countryCode: "198",
    countryName: "Slovenia",
    shortName: "Slovenia",
    isoa2: "SI",
    score: "3A"
  },
  {
    id: "149",
    version: "",
    countryCode: "199",
    countryName: "Slovakia",
    shortName: "Slovakia",
    isoa2: "SK",
    score: "3A"
  },
  {
    id: "150",
    version: "",
    countryCode: "200",
    countryName: "Singapore",
    shortName: "Singapore",
    isoa2: "SG",
    score: "3A"
  },
  {
    id: "151",
    version: "",
    countryCode: "201",
    countryName: "Somalia",
    shortName: "Somalia",
    isoa2: "SO",
    score: "3A"
  },
  {
    id: "152",
    version: "",
    countryCode: "202",
    countryName: "South Africa",
    shortName: "South Africa",
    isoa2: "ZA",
    score: "2A"
  },
  {
    id: "153",
    version: "",
    countryCode: "203",
    countryName: "Spain",
    shortName: "Spain",
    isoa2: "ES",
    score: "3A"
  },
  {
    id: "154",
    version: "",
    countryCode: "206",
    countryName: "Sudan (former)",
    shortName: "Sudan (former)",
    isoa2: "",
    score: "3A"
  },
  {
    id: "155",
    version: "",
    countryCode: "207",
    countryName: "Suriname",
    shortName: "Suriname",
    isoa2: "SR",
    score: "3A"
  },
  {
    id: "156",
    version: "",
    countryCode: "208",
    countryName: "Tajikistan",
    shortName: "Tajikistan",
    isoa2: "TJ",
    score: "2A"
  },
  {
    id: "157",
    version: "",
    countryCode: "209",
    countryName: "Eswatini",
    shortName: "Swaziland",
    isoa2: "SZ",
    score: "2A"
  },
  {
    id: "158",
    version: "",
    countryCode: "210",
    countryName: "Sweden",
    shortName: "Sweden",
    isoa2: "SE",
    score: "3A"
  },
  {
    id: "159",
    version: "",
    countryCode: "211",
    countryName: "Switzerland",
    shortName: "Switzerland",
    isoa2: "CH",
    score: "3A"
  },
  {
    id: "160",
    version: "",
    countryCode: "212",
    countryName: "Syrian Arab Republic",
    shortName: "Syria",
    isoa2: "SY",
    score: "3A"
  },
  {
    id: "161",
    version: "",
    countryCode: "213",
    countryName: "Turkmenistan",
    shortName: "Turkmenistan",
    isoa2: "TM",
    score: "2A"
  },
  {
    id: "162",
    version: "",
    countryCode: "215",
    countryName: "Tanzania, United Republic of",
    shortName: "Tanzania",
    isoa2: "TZ",
    score: "3A"
  },
  {
    id: "163",
    version: "",
    countryCode: "216",
    countryName: "Thailand",
    shortName: "Thailand",
    isoa2: "TH",
    score: "3A"
  },
  {
    id: "164",
    version: "",
    countryCode: "217",
    countryName: "Togo",
    shortName: "Togo",
    isoa2: "TG",
    score: "3A"
  },
  {
    id: "165",
    version: "",
    countryCode: "219",
    countryName: "Tonga",
    shortName: "Tonga",
    isoa2: "TO",
    score: "2B"
  },
  {
    id: "166",
    version: "",
    countryCode: "220",
    countryName: "Trinidad and Tobago",
    shortName: "Trinidad and Tobago",
    isoa2: "TT",
    score: "2A"
  },
  {
    id: "167",
    version: "",
    countryCode: "221",
    countryName: "Oman",
    shortName: "Oman",
    isoa2: "OM",
    score: "3A"
  },
  {
    id: "168",
    version: "",
    countryCode: "222",
    countryName: "Tunisia",
    shortName: "Tunisia",
    isoa2: "TN",
    score: "3A"
  },
  {
    id: "169",
    version: "",
    countryCode: "223",
    countryName: "Turkey",
    shortName: "Turkey",
    isoa2: "TR",
    score: "3A"
  },
  {
    id: "170",
    version: "",
    countryCode: "225",
    countryName: "United Arab Emirates",
    shortName: "United Arab Emirates",
    isoa2: "AE",
    score: "3A"
  },
  {
    id: "171",
    version: "",
    countryCode: "226",
    countryName: "Uganda",
    shortName: "Uganda",
    isoa2: "UG",
    score: "3A"
  },
  {
    id: "172",
    version: "",
    countryCode: "228",
    countryName: "USSR",
    shortName: "USSR",
    isoa2: "SUN",
    score: "2B"
  },
  {
    id: "173",
    version: "",
    countryCode: "229",
    countryName: "United Kingdom",
    shortName: "United Kingdom",
    isoa2: "GB",
    score: "3A"
  },
  {
    id: "174",
    version: "",
    countryCode: "230",
    countryName: "Ukraine",
    shortName: "Ukraine",
    isoa2: "UA",
    score: "2A"
  },
  {
    id: "175",
    version: "",
    countryCode: "231",
    countryName: "United States of America",
    shortName: "United States",
    isoa2: "US",
    score: "3A"
  },
  {
    id: "176",
    version: "",
    countryCode: "233",
    countryName: "Burkina Faso",
    shortName: "Burkina Faso",
    isoa2: "BF",
    score: "3A"
  },
  {
    id: "177",
    version: "",
    countryCode: "234",
    countryName: "Uruguay",
    shortName: "Uruguay",
    isoa2: "UY",
    score: "2B"
  },
  {
    id: "178",
    version: "",
    countryCode: "235",
    countryName: "Uzbekistan",
    shortName: "Uzbekistan",
    isoa2: "UZ",
    score: "3A"
  },
  {
    id: "179",
    version: "",
    countryCode: "236",
    countryName: "Venezuela, Bolivarian Republic of",
    shortName: "Venezuela",
    isoa2: "VE",
    score: "3A"
  },
  {
    id: "180",
    version: "",
    countryCode: "237",
    countryName: "Viet Nam",
    shortName: "Viet Nam",
    isoa2: "VN",
    score: "3A"
  },
  {
    id: "181",
    version: "",
    countryCode: "238",
    countryName: "Ethiopia",
    shortName: "Ethiopia",
    isoa2: "ET",
    score: "3A"
  },
  {
    id: "182",
    version: "",
    countryCode: "244",
    countryName: "Samoa",
    shortName: "Samoa",
    isoa2: "WS",
    score: "2B"
  },
  {
    id: "183",
    version: "",
    countryCode: "248",
    countryName: "Yugoslav SFR",
    shortName: "Yugoslavia",
    isoa2: "YUCS",
    score: "2B"
  },
  {
    id: "184",
    version: "",
    countryCode: "249",
    countryName: "Yemen",
    shortName: "Yemen",
    isoa2: "YE",
    score: "3A"
  },
  {
    id: "185",
    version: "",
    countryCode: "250",
    countryName: "Congo, Democratic Republic of",
    shortName: "Congo DR",
    isoa2: "CD",
    score: "3A"
  },
  {
    id: "186",
    version: "",
    countryCode: "251",
    countryName: "Zambia",
    shortName: "Zambia",
    isoa2: "ZM",
    score: "3A"
  },
  {
    id: "187",
    version: "",
    countryCode: "255",
    countryName: "Belgium",
    shortName: "Belgium",
    isoa2: "BE",
    score: "3A"
  },
  {
    id: "188",
    version: "",
    countryCode: "256",
    countryName: "Luxembourg",
    shortName: "Luxembourg",
    isoa2: "LU",
    score: "3A"
  },
  {
    id: "189",
    version: "",
    countryCode: "272",
    countryName: "Serbia",
    shortName: "Serbia",
    isoa2: "RS",
    score: "3A"
  },
  {
    id: "190",
    version: "",
    countryCode: "273",
    countryName: "Montenegro",
    shortName: "Montenegro",
    isoa2: "ME",
    score: "3A"
  },
  {
    id: "191",
    version: "",
    countryCode: "276",
    countryName: "Sudan",
    shortName: "Sudan",
    isoa2: "SD",
    score: "3A"
  },
  {
    id: "192",
    version: "",
    countryCode: "277",
    countryName: "South Sudan",
    shortName: "South Sudan",
    isoa2: "SS",
    score: "3A"
  },
  {
    id: "193",
    version: "",
    countryCode: "351",
    countryName: "China",
    shortName: "China",
    isoa2: "CN",
    score: "3A"
  }
];

export default countryList;
