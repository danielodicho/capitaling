countries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros", "DR Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Republic of the Congo", "Rwanda", "São Tomé  and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe",
"Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "East Timor", "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Myanmar", "Nepal", "North Korea", "Oman", "Pakistan", "State of Palestine", "Philippines", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Turkey", "Turkmenistan", "UAE", "Uzbekistan", "Vietnam", "Yemen",
"Antigua and Barbuda", "Argentina", "Bahamas", "Barbados", "Belize", "Bolivia", "Brazil", "Canada", "Chile", "Colombia", "Costa Rica", "Cuba", "Dominica", "Dominican Republic", "Ecuador", "El Salvador", "Grenada", "Guatemala", "Guyana", "Haiti", "Honduras", "Jamaica", "Mexico", "Nicaragua", "Panama", "Paraguay", "Peru", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and Grenadines", "Suriname", "Trinidad and Tobago", "United States", "Uruguay", "Venezuela",
"Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City",
"Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"]



have_look_alikes = [0,2,6,9,18,20,21,22,23,26,30,33,36,40,41,43,44,45,48,50,
55,57,62,65,66,67,68, 71,75,77,82,84,85,87,88,93,94,95,96,97,99,101,102,
138,139,140,142,144,145,148,152,153,154,155,156,157,159,160,161,162,164,165,166, 167,169,170,172,174,175,176,178,
183,184, 187,189,192,195,196,
104,112,117,128,136,137,
113,118,120,122,123,125,126,130
]

lookalikes = [
[84],[22],[30,41,21],[139,164,55],[43],[40],[30,41,6],[2],[156,157],[77],[41,21,6],
[62],[65],[20],[30,21,6],[18],[187],[196],[130],[97],
[161],[87],[101,33],[36],
[170,57,84],[95],[93,102],[85,99],[82],[26],[75],[0],[71,99],[57],[175,176],[68,102],[192],[67],[113],[50],[71,85],[62],[68,93],[166],[172,164],[159],[152],[154],[167],[169],[142],[136],[144],[178],[157,23],[156,125],[140],[122],[55],[167],[139,172],[170,163,173],[138],[162],[155,148],[165,66],[139,164,142],[175],[176,88],[88,175],[155],
[189],[196],[44],[183],[94],[184],[45],
[120],[117,137],[137,112],[167,145],[153],[117,112],
[96],[126,123],[104],[160],[118,126],[157],[118,123],[48]
]

print(countries[lookalikes[0][0]])

list_of_countries = []
for idx, country_idx in enumerate(have_look_alikes):
    country_data = {
		"country": countries[country_idx],
		"capital": "tbd",
		"flagImage": "/images/svg/XXX.svg",
		"similarCountries": [],
		"similarCapitals": [],
	}
    # print(country_idx,x, "hi")
    for country in lookalikes[idx]:
        country_data["similarCountries"].append(countries[country])
    list_of_countries.append(country_data)
    
# print(len(list_of_countries), len(have_look_alikes))
for idx in range(len(countries)):
    country_data = {
		"country": countries[idx],
		"capital": "tbd",
		"flagImage": "/images/svg/XXX.svg",
		"similarCountries": [],
		"similarCapitals": [],
	}
    if idx not in have_look_alikes:
        list_of_countries.append(country_data)

print(list_of_countries)