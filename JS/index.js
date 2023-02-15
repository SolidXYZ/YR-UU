/*
googles API liker ikke nettsiden min og kors blokkerer det
så du my trykke på 'Request temporary access to the demo server'
på denne nettsiden 'https://cors-anywhere.herokuapp.com/corsdemo'
for at adressesøkefeltet skal fungere
*/
const weatherContainer = getElFromID('weather_container');
const weatherTable = getElFromID('weather_table');
const getCurrentLocationButton = getElFromID('search_form_use_current');
const searchForm = getElFromID('search_form');
const searchTextInput = getElFromID('search_text_input');
const searchSelectInput = getElFromID('search_select_input');
const settingsForm = getElFromID('settings_form');
const latRangeInput = getElFromID('latitude_range_input');
const lonRangeInput = getElFromID('longitude_range_input');
const altRangeInput = getElFromID('altitude_range_input');
const latNumInput = getElFromID('latitude_num_input');
const lonNumInput = getElFromID('longitude_num_input');
const altNumInput = getElFromID('altitude_num_input');
const dateStartInput = getElFromID('date_input');
const timeInput = getElFromID('time_input');
const filterTypeInput = getElFromID('filter_type_input');
const changeColorThemeButton = getElFromID('change_color_theme');
const changeFontSizeButton = getElFromID('change_font_size');
const toggleAnimationsButton = getElFromID('toggle_animations');
const timePeriods = [
    1,
    6,
    12,
];
const timePeriodsAmount = timePeriods.length + 1;
const geocodeAPIKey = 'AIzaSyDEgedK3GOb2jdyiy3BrU5uiFvkARR7YlQ';
const geocodeAPIBaseURL = 'https://maps.googleapis.com/maps/api/';
const windDirIcon = '⬆';
const customUnits = {
    'celsius': '&degC',
    'fahrenheit': '&degF',
    'degrees': '&deg',
};
const colorThemes = [
    'light',
    'dark',
    'contrast',
];
const colorThemesColors = {
    'light': {
        'theme_col': 'rgb(255, 255, 255)',
        'colors': {
            'light-col': 'rgb(215, 230, 255)',
            'main-col': 'rgb(190, 214, 255)',
            'border-col': 'rgb(84, 147, 254)',
            'tab-prim-col': 'rgb(141, 183, 255)',
            'tab-sec-col': 'rgb(118, 168, 255)',
            'highlight-col': 'rgb(62, 133, 255)',
            'prim-text-col': 'rgb(0, 0, 0)',
            'sec-text-col': 'rgb(100, 100, 100)',
            'select-col': 'rgb(48, 124, 255)',
        }
    },
    'dark': {
        'theme_col': 'rgb(0, 0, 0)',
        'colors': {
            'light-col': 'rgb(31, 31, 31)',
            'main-col': 'rgb(46, 46, 46)',
            'border-col': 'rgb(60, 60, 60)',
            'tab-prim-col': 'rgb(41, 41, 41)',
            'tab-sec-col': 'rgb(34, 34, 34)',
            'highlight-col': 'rgb(32, 32, 32)',
            'prim-text-col': 'rgb(255, 255, 255)',
            'sec-text-col': 'rgb(100, 100, 100)',
            'select-col': 'rgb(255, 255, 255)',
        }
    },
    'contrast': {
        'theme_col': 'rgb(255, 255, 0)',
        'colors': {
            'light-col': 'rgb(0, 0, 0)',
            'main-col': 'rgb(0, 0, 0)',
            'border-col': 'rgb(255, 255, 0)',
            'tab-prim-col': 'rgb(50, 50, 50)',
            'tab-sec-col': 'rgb(25, 25, 25)',
            'highlight-col': 'rgb(100, 100, 0)',
            'prim-text-col': 'rgb(255, 255, 0)',
            'sec-text-col': 'rgb(150, 150, 0)',
            'select-col': 'rgb(255, 0, 0)',
        }
    }
};
const fontSizes = [
    'extra_small',
    'small',
    'medium',
    'large',
    'extra_large',
];
const fontSizesSizes = {
    'extra_small': {
        'sizes': {
            'small': `4px`,
            'medium': `8px`,
            'large': `16px`,
        }
    },
    'small': {
        'sizes': {
            'small': `8px`,
            'medium': `12px`,
            'large': `20px`,
        }
    },
    'medium': {
        'sizes': {
            'small': `12px`,
            'medium': `16px`,
            'large': `24px`,
        }
    },
    'large': {
        'sizes': {
            'small': `16px`,
            'medium': `20px`,
            'large': `28px`,
        }
    },
    'extra_large': {
        'sizes': {
            'small': `20px`,
            'medium': `24px`,
            'large': `32px`,
        }
    },
};
const HTMLRootStyle = document.documentElement.style;
const tableRows = [];
let searchingForGeoLocation = false;
let curColorTheme = 'light';
let curFontSize = 'medium';
let animationsEnabled = true;
let noAnimIcon;
function getElFromID(n) {
    return document.getElementById(n);
}
function getElsFromClassName(n) {
    return document.getElementsByClassName(n);
}
function metaUnitToUnit(unit) {
    const customUnit = customUnits[unit];
    let res;
    if (customUnit !== undefined) {
        res = customUnit;
    } else {
        res = unit;
    }
    return res;
}
function rawDataToUnit(tableData, name) {
    return metaUnitToUnit(tableData.data.properties.meta.units[name]);
}
function toFixed(num, amount) {
    return Number(num.toFixed(amount));
}
function fToC(x) {
    return (x - 32) * (5 / 9);
}
function getFAndC(x) {
    return `${toFixed(fToC(x), 3)} ${metaUnitToUnit('celsius')} (${toFixed(x, 3)} ${metaUnitToUnit('fahrenheit')})`;
}
function getWeatherSymbolFromString(str) {
    return `https://api.met.no/images/weathericons/svg/${str}.svg`;
}
function dateToRange(date) {
    let yr = date.getUTCFullYear().toString();
    if (yr.length === 1) {
        yr = '0' + yr;
    }
    let mth = (date.getUTCMonth() + 1).toString();
    if (mth.length === 1) {
        mth = '0' + mth;
    }
    let dy = date.getUTCDate().toString();
    if (dy.length === 1) {
        dy = '0' + dy;
    }
    return yr + '-' + mth + '-' + dy;
}
function timeToRange(date) {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
function strToASCII(str) {
    return str.replace(' ', '%20');
}
function arrToASCII(arr) {
    let res = '';
    const finI = arr.length - 1;
    for (let i = 0; i < arr.length; i++) {
        res += arr[i];
        if (i < finI) {
            res += '%2C';
        }
    }
    return res;
}
function getGeocodeURL(str) {
    return `${geocodeAPIBaseURL}${str}&key=${geocodeAPIKey}`;
}
function getGeocodeLocationURL(loc, fields = ['formatted_address', 'geometry']) {
    return /*`https://cors-anywhere.herokuapp.com/` + */getGeocodeURL(`place/findplacefromtext/json?fields=${arrToASCII(fields)}&input=${strToASCII(loc)}&inputtype=textquery`);
}
function getAutocompleteURL(str, types = 'geocode') {
    return /*`https://cors-anywhere.herokuapp.com/` + */getGeocodeURL(`place/autocomplete/json?input=${strToASCII(str)}&types=${types}`);
}
function getPlaceLocationURL(placeID) {
    return /*`https://cors-anywhere.herokuapp.com/` + */getGeocodeURL(`place/details/json?place_id=${placeID}`);
}
function fetchWithTimeout(resource, options = {}) {
    return new Promise(async (resolve, reject) => {
        try {
            const { timeout = 5000 } = options;
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);
            const headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Access-Control-Allow-Credentials', 'true');
            const response = await fetch(resource, { ...options, signal: controller.signal, headers: headers});
            clearTimeout(id);
            resolve(response);
        } catch (error) {
            console.error(`Fetch error, Timeout: ${error.name === 'AbortError'}. Error: ${error}`);
            reject(error);
        }
    });
}
function fetchGeocodeLocation(...args) {
    return fetchWithTimeout(getGeocodeLocationURL(...args));
}
function fetchAutocompletePlaces(...args) {
    return fetchWithTimeout(getAutocompleteURL(...args));
}
function fetchPlaceLocation(...args) {
    return fetchWithTimeout(getPlaceLocationURL(...args));
}
function fetchData(type, lat, lon, alt) {
    return fetchWithTimeout(`https://api.met.no/weatherapi/locationforecast/2.0/${type}?lat=${lat}&lon=${lon}&altitude=${alt}`); //tydeligvis er lon og lat motsatt
}
async function getRawGeocodeLocation(...args) {
    return fetchGeocodeLocation(...args)
        .then(response => response.json())
}
async function getAutocompletePlaces(...args) {
    return fetchAutocompletePlaces(...args)
        .then(response => response.json())
}
async function getPlaceLocation(...args) {
    return fetchPlaceLocation(...args)
        .then(response => response.json())
}
async function getRawData(...args) {
    return fetchData(...args)
        .then(response => response.json())
}
function hToMs(x) {
    return x * 60 * 60 * 1000;
}
function trySetDetails(details, data, f) {
    const v = details[data.dataSource];
    if (v !== undefined) {
        f(v);
    }
}
function trySetMinMaxDetails(details, data, f) {
    const n = data.dataSource;
    const minV = details[n + '_min'];
    if (minV !== undefined) {
        const maxV = details[n + '_max'];
        if (maxV !== undefined) {
            f(minV, maxV);
        }
    }
}
function trySetLowMediumHighDetails(details, data, f) {
    const n = data.dataSource;
    const finalV = details[n];
    if (finalV !== undefined) {
        const lowV = details[n + '_low'];
        if (lowV !== undefined) {
            const mediumV = details[n + '_medium'];
            if (mediumV !== undefined) {
                const highV = details[n + '_high'];
                if (highV !== undefined) {
                    f(finalV, lowV, mediumV, highV);
                }
            }
        }
    }
}
function trySetSummary(summary, data, f) {
    const v = summary[data.dataSource];
    if (v !== undefined) {
        f(v);
    }
}
function addTableRow(name, className, text, dataSource, source, isText, textName, func, resetFunc) {
    tableRows.push({
        name: name,
        className: className,
        text: text,
        dataSource: dataSource,
        source: source,
        isText: isText,
        textName: textName,
        func: func,
        resetFunc: resetFunc,
    });
}
addTableRow('symbol', 'symbol', 'Weather', 'symbol_code', 'summary', false, undefined, function (tableData, periodName, data) {
    trySetSummary(data, this, (v) => {
        tableElements[this.name][periodName].icon.style.backgroundImage = `url(${getWeatherSymbolFromString(v)})`;
    });
}, function (tableData, periodName) {
    delete tableElements[this.name][periodName].icon.style.backgroundImage;
});
addTableRow('rain', 'rain_amount', 'Rain', 'precipitation_amount', 'details', true, 'main', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = `${v.toString()} ${rawDataToUnit(tableData, this.dataSource)}`;
    });
});
addTableRow('airTemp', 'air_temp', 'Air temperature', 'air_temperature', 'details', true, 'main', function (tableData, periodName, data) {
    trySetMinMaxDetails(data, this, (minV, maxV) => {
        tableElements[this.name][periodName][this.textName].innerHTML = `${getFAndC(minV)}<br>${getFAndC(maxV)}`;
    });
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = getFAndC(v);
    });
});
addTableRow('dewPointTemp', 'dew_point_temp', 'Dew point temperature', 'dew_point_temperature', 'details', true, 'main', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = getFAndC(v);
    });
});
addTableRow('airPressureAtSeaLevel', 'air_pressure_at_sea_level', 'Air pressure at sea level', 'air_pressure_at_sea_level', 'details', true, 'main', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = `${v.toString()} ${rawDataToUnit(tableData, this.dataSource)}`;
    });
});
addTableRow('CloudAreaFraction', 'cloud_area_fraction', 'Cloud area fraction', 'cloud_area_fraction', 'details', true, 'main', function (tableData, periodName, data) {
    trySetLowMediumHighDetails(data, this, (finalV, lowV, mediumV, highV) => {
        const unit = rawDataToUnit(tableData, this.dataSource);
        tableElements[this.name][periodName][this.textName].innerHTML = `Total: ${finalV.toString()} ${unit}<br>High: ${highV.toString()} ${unit}<br>Medium: ${mediumV.toString()} ${unit}<br>Low: ${lowV.toString()} ${unit}`;
    });
});
addTableRow('windFromDirection', 'wind_from_direction', 'Wind from direction', 'wind_from_direction', 'details', true, 'text', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        const unit = rawDataToUnit(tableData, this.dataSource);
        const obj = tableElements[this.name][periodName];
        obj[this.textName].innerHTML = `${v.toString()} ${unit}`;
        obj.icon.style.transform = `translate(-50%, -50%) rotate(${v.toString()}deg)`
    });
}, function (tableData, periodName) {
    const obj = tableElements[this.name][periodName];
    obj.icon.style.transform = `translate(-50%, -50%)`;
});
addTableRow('windSpeed', 'wind_speed', 'Wind speed', 'wind_speed', 'details', true, 'main', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = `${v.toString()} ${rawDataToUnit(tableData, this.dataSource)}`;
    });
});
addTableRow('fogAreaFraction', 'fog_area_fraction', 'Fog area fraction', 'fog_area_fraction', 'details', true, 'main', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = `${v.toString()} ${rawDataToUnit(tableData, this.dataSource)}`;
    });
});
addTableRow('relativeHumidity', 'relative_humidity', 'Relative humidity', 'relative_humidity', 'details', true, 'main', function (tableData, periodName, data) {
    trySetDetails(data, this, (v) => {
        tableElements[this.name][periodName][this.textName].innerHTML = `${v.toString()} ${rawDataToUnit(tableData, this.dataSource)}`;
    });
});
const [tableElements, tableContainers] = loadUI();
function getTableRowElements(name) {
    let res;
    for (let i = 0; i < tableRows.length; i++) {
        const arr = tableRows[i];
        if (arr.name === name) {
            res = arr;
            break;
        }
    }
    return res;
}
function getNextInArr(arr, cur) {
    const curI = arr.indexOf(cur);
    const targ = curI + 1;
    let newI;
    if (targ == arr.length) {
        newI = 0;
    } else {
        newI = targ
    }
    return arr[newI];
}
function getNextColorTheme(cur) {
    return getNextInArr(colorThemes, cur);
}
function getNextFontSize(cur) {
    return getNextInArr(fontSizes, cur);
}
function setColorTheme(theme) {
    const newThemeColors = colorThemesColors[theme];
    HTMLRootStyle.setProperty('--cur-theme-col', newThemeColors.theme_col);
    HTMLRootStyle.setProperty('--next-theme-col', colorThemesColors[getNextColorTheme(theme)].theme_col);
    for (const [i, v] of Object.entries(newThemeColors.colors)) {
        HTMLRootStyle.setProperty('--' + i, v);
    }
}
function setFontSize(size) {
    const newSizes = fontSizesSizes[size];
    for (const [i, v] of Object.entries(newSizes.sizes)) {
        HTMLRootStyle.setProperty('--font-size-' + i, v);
    }
}
function isOptionFirst(el) {
    return el.options[0].value === el.value;
}
function setRawCurWidthVar(el, x) {
    el.style.setProperty('--cur-width', x);
}
function setRawCurHeightVar(el, x) {
    el.style.setProperty('--cur-height', x);
}
function setCurWidthVar(el, x = el.offsetWidth) {
    setRawCurWidthVar(el, x.toString() + 'px');
}
function setCurHeightVar(el, x = el.offsetHeight) {
    setRawCurHeightVar(el, x.toString() + 'px');
}
function setCurWidthHeightVar(el) {
    setCurWidthVar(el);
    setCurHeightVar(el);
}
function strToPx(s) {
    return Number(s.substring(0, s.length - 2));
}
function loadUI() {
    const settingFormLabelsContainer = getElFromID('settings_form_labels');
    const settingFormInputsContainer = getElFromID('settings_form_inputs');
    const settingFormRangesContainer = getElFromID('settings_form_ranges');
    const settingFormLabels = settingFormLabelsContainer.children;
    const settingFormRanges = settingFormRangesContainer.children;
    const rangeEls = document.querySelectorAll('input[type=range]');

    function resizeUpdate() {
        {
            HTMLRootStyle.setProperty('--sub-margin', (Math.min(weatherContainer.offsetWidth, weatherContainer.offsetHeight) * 0.01).toString() + 'px');
        }
        {
            for (const child of settingFormLabels) {
                const match = settingFormInputsContainer.querySelectorAll(`[id="${child.getAttribute('for')}"]`)[0];
                child.style.left = match.offsetLeft.toString() + 'px';
            }
        }
        {
            for (const child of settingFormRanges) {
                const match = settingFormInputsContainer.querySelectorAll(`[id="${child.dataset.for.replace('_range', '')}"]`)[0];
                child.style.width = match.offsetWidth.toString() + 'px';
                child.style.left = match.offsetLeft.toString() + 'px';
            }
        }
        /*
        {
            for (const el of getElsFromClassName('cell')) {
                setCurWidthHeightVar(el);
            }
        }
        */
        {
            for (const el of rangeEls) {
                setCurWidthHeightVar(el);
            }
        }
    }
    window.onresize = resizeUpdate;
    /*
    function req() {
        resizeUpdate();
        window.requestAnimationFrame(req);
    }
    req();
    */





    const curDate = new Date();
    const curDateRange = dateToRange(curDate);
    dateStartInput.value = curDateRange;
    dateStartInput.min = curDateRange;
    dateStartInput.max = dateToRange(new Date(new Date().valueOf() + (9 * 24 * 60 * 60 * 1000)));
    timeInput.value = timeToRange(curDate);
    const weatherTableContainer = getElFromID('weather_table');
    const newTableElements = {};
    const newTableContainers = {};
    {
        const mainEl = document.createElement('div');
        mainEl.id = 'time_periods_container';
        mainEl.classList.add('cell_category');
        weatherTableContainer.appendChild(mainEl);

        const tel = document.createElement('div');
        tel.classList.add('time_periods_cell');
        tel.classList.add('cell');
        tel.innerHTML = "Time";
        mainEl.appendChild(tel);

        function addTimePeriod(str) {
            const mel = document.createElement('div');
            mel.classList.add('time_periods_cell');
            mel.classList.add('cell');
            mel.innerHTML = str;
            mainEl.appendChild(mel);
        }
        addTimePeriod('Now');
        for (let i = 0; i < timePeriods.length; i++) {
            let am = timePeriods[i];
            let type = 'hour';
            let teller = 'Next';
            let str = teller + ' ';
            if (am === 1) {
                str += 'hour';
            } else {
                str += am.toString() + ' ' + type + 's';
            }
            addTimePeriod(str);
        }
    }
    for (let i = 0; i < tableRows.length; i++) {
        const v = tableRows[i];
        newTableElements[v.name] = [];
        const mel = document.createElement('div');
        mel.id = `weather_${v.className}_container`;
        mel.classList.add('cell_category');
        mel.classList.add('category_container');
        newTableContainers[v.name] = mel;
        weatherTableContainer.appendChild(mel);
        const fel = document.createElement('div');
        fel.innerHTML = v.text;
        fel.classList.add('category_name');
        fel.classList.add('cell');
        mel.appendChild(fel);
    }
    for (let i = 0; i < timePeriodsAmount; i++) {
        for (let [n, v] of Object.entries(newTableElements)) {
            const newArr = [];
            const el = document.createElement('div');
            el.classList.add('cell');
            el.classList.add('info_cell');
            el.classList.add('weather_' + getTableRowElements(n).className);
            newArr.main = el;
            newTableElements[n].push(newArr);
            newTableContainers[n].appendChild(el);
        }

        const windArr = newTableElements.windFromDirection[i];
        const windText = document.createElement('div');
        windText.className = 'weather_wind_text';
        windArr.text = windText;
        windArr.main.appendChild(windText);

        const windIcon = document.createElement('div');
        windIcon.className = 'weather_wind_icon';
        windIcon.innerHTML = windDirIcon;
        windArr.icon = windIcon;
        windArr.main.appendChild(windIcon);

        const symbolArr = newTableElements.symbol[i];
        const symbol = document.createElement('div');
        symbol.className = 'weather_symbol_icon';
        symbolArr.icon = symbol;
        symbolArr.main.appendChild(symbol);
    }
    function bindInput(input1, input2) {
        function input1Change() {
            input2.value = input1.value;
        }
        function input2Change() {
            input1.value = input2.value;
        }
        input1.oninput = input1Change;
        input2.oninput = input2Change;
        input1Change();
    }
    function setLon(val) {
        lonNumInput.value = lonRangeInput.value = val.toString();
    }
    function setLat(val) {
        latNumInput.value = latRangeInput.value = val.toString();
    }
    function setAlt(val) {
        altNumInput.value = altRangeInput.value = val.toString();
    }
    function setCoords(lon, lat) {
        setLon(lon);
        setLat(lat);
    }
    function setFullCoords(lon, lat, alt) {
        setCoords(lon, lat);
        setAlt(alt);
    }
    bindInput(lonNumInput, lonRangeInput);
    bindInput(latNumInput, latRangeInput);
    bindInput(altNumInput, altRangeInput);

    setFullCoords(0, 0, 0);

    let curOptions

    searchTextInput.oninput = () => {
        if (searchTextInput.value.length >= 5) {
            if (searchingForGeoLocation === false) {
                const opt = searchSelectInput.options[0];
                searchSelectInput.innerHTML = '';
                searchSelectInput.appendChild(opt);
                searchingForGeoLocation = true;
                getAutocompletePlaces(searchTextInput.value)
                    .then((data) => {
                        searchingForGeoLocation = false;
                        if (data !== undefined) {
                            const res = data.predictions;
                            if (res !== undefined) {
                                curOptions = res;
                                for (let i = 0; i < res.length; i++) {
                                    const optData = res[i];
                                    const opt = document.createElement('option');
                                    opt.innerHTML = optData.description;
                                    opt.value = i.toString();
                                    searchSelectInput.appendChild(opt);
                                }
                            } else {
                                console.error('!!! ADDRESS API HAS NO RESULT DATA !!!', data);
                            }
                        } else {
                            console.error('!!! ADDRESS API RETURNED NO DATA !!!');
                        }
                    })
                    .catch((error) => {
                        console.error('!!! API FAILED: ', error);
                    });
            }
        }
    }
    getCurrentLocationButton.onclick = (e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition(
            (data) => {
                const coords = data.coords;
                setFullCoords(coords.latitude, coords.longitude, coords.altitude || 0);
            },
            (error) => {
                console.error('error getting current position: ', error);
            },
        )
    }
    searchForm.onsubmit = (e) => {
        e.preventDefault();
        if (isOptionFirst(searchSelectInput) === false) {
            const placeData = curOptions[Number(searchSelectInput.value)];
            getPlaceLocation(placeData.place_id)
                .then((data) => {
                    const loc = data.result.geometry.location;
                    setCoords(loc.lat, loc.lng);
                })
        }
    };
    settingsForm.onsubmit = (e) => {
        e.preventDefault();
        if (isOptionFirst(filterTypeInput) === false) {
            updateData(filterTypeInput.value, new Date(dateStartInput.value + 'T' + timeInput.value + 'Z'), 'complete', Number(latNumInput.value).toFixed(15), Number(lonNumInput.value).toFixed(15), altNumInput.value);
        }
    };

    {
        changeColorThemeButton.onclick = (e) => {
            e.preventDefault();
            curColorTheme = getNextColorTheme(curColorTheme);
            setColorTheme(curColorTheme);
        }
    }

    {
        changeFontSizeButton.onclick = (e) => {
            e.preventDefault();
            curFontSize = getNextFontSize(curFontSize);
            setFontSize(curFontSize);
        }
    }

    {
        toggleAnimationsButton.onclick = (e) => {
            e.preventDefault();
            animationsEnabled = animationsEnabled === false;
            let newVal;
            if (animationsEnabled === true) {
                newVal = '0.5s';
                noAnimIcon.remove();
                noAnimIcon = undefined;
            } else {
                noAnimIcon = document.createElement('img');
                noAnimIcon.id = 'no_image';
                noAnimIcon.src = 'Images/no.png';
                noAnimIcon.alt = 'no_icon';
                toggleAnimationsButton.appendChild(noAnimIcon);
            }
            HTMLRootStyle.setProperty('--transition-time', newVal);
        }
    }

    {
        HTMLRootStyle.setProperty('--transition-time', '0s');
        setColorTheme(curColorTheme);
        setFontSize(curFontSize);
        setTimeout(() => {
            HTMLRootStyle.setProperty('--transition-time', '0.5s');
        }, 0);
    }

    resizeUpdate();

    return [newTableElements, newTableContainers];
}
function correctData(period) {
    const newArr = [];
    for (const [periodName, periodData] of Object.entries(period.data)) {
        let i;
        let time;
        if (periodName === 'instant') {
            time = 0;
            i = 0;
        } else {
            const pri = Number(periodName.replace('next_', '').replace('_hours', ''))
            time = hToMs(pri);
            i = timePeriods.indexOf(pri) + 1;
        }
        newArr[i] = periodData;
        periodData.time = time;
    }
    period.data = newArr;
}
function correctAllData(arr) {
    for (const period of arr) {
        correctData(period);
    }
}
function getDataIndAtTime(timeInMS, arr) {
    let res;
    for (let i = 0; i < arr.length; i++) {
        const cur = arr[i];
        if (new Date(cur.time).valueOf() >= timeInMS) {
            res = i - 1;
            break;
        }
    }
    return res;
}
function getData(filterType, time, type, lat, lon, alt) {
    return new Promise((resolve, reject) => {
        getRawData(type, lat, lon, alt)
            .then((data) => {
                const timeInMS = time.valueOf();
                const arr = data.properties.timeseries;
                correctAllData(arr);
                let res;
                if (filterType === 'basic') {
                    res = arr[getDataIndAtTime(timeInMS, arr)];
                } else if (filterType === 'enhanced') {
                    function fillInMissingProps(arr1, arr2) {
                        for (const [prop, val] of Object.entries(arr2)) {
                            if (arr1[prop] === undefined) {
                                arr1[prop] = val;
                            }
                        }
                    }
                    function fillInMissingDataSpot(n, data1, data2) {
                        if (data2[n] !== undefined) {
                            if (data1[n] === undefined) {
                                data1[n] = {};
                            }
                            fillInMissingProps(data1[n], data2[n]);
                        }
                    }
                    function fillInMissingData(data1, data2) {
                        fillInMissingDataSpot('summary', data1, data2);
                        fillInMissingDataSpot('details', data1, data2);
                    }
                    res = arr[getDataIndAtTime(timeInMS, arr)];
                    const data = res.data;
                    let i = 1;
                    for (const period of timePeriods) {
                        fillInMissingData(data[i], arr[getDataIndAtTime(timeInMS + hToMs(period), arr)].data[0]);
                        i += 1;
                    }
                } else if (filterType === 'advanced') {
                    const layerData = [];
                    for (let i = 0; i < arr.length; i++) {
                        const periodData = arr[i];
                        const curTimeInMs = new Date(periodData.time).valueOf();
                        function addLayer(layer, period, time) {
                            const checkData = getDataIndAtTime(time, layerData);
                            let curData;
                            if (checkData === undefined) {
                                curData = {
                                    time: time,
                                    layers: [],
                                };
                                layerData.push(curData);
                            } else {
                                curData = layerData[checkData];
                            }
                            const newData = {};
                            function tryAdd(n) {
                                const check = period[n];
                                if (check !== undefined) {
                                    newData[n] = check;
                                }
                            }
                            tryAdd('details');
                            tryAdd('summary');
                            curData.layers[layer] = newData;
                        }
                        const cData = periodData.data;
                        for (let cI = 0; cI < cData.length; cI++) {
                            const period = cData[cI];
                            if (period === undefined) {
                                console.warn('!!! MISSING PERIOD VALUE: ' + cI.toString());
                                continue;
                            }
                            addLayer(cI, period, curTimeInMs + period.time);
                        }
                    }
                    const finalData = [];
                    for (let i = 0; i < layerData.length; i++) {
                        const curData = layerData[i];
                        const layers = curData.layers;
                        const newData = {
                            time: curData.time,
                        };
                        function fillInMissingProps(arr1, arr2) {
                            for (const [prop, val] of Object.entries(arr2)) {
                                if (arr1[prop] === undefined) {
                                    arr1[prop] = val;
                                }
                            }
                        }
                        function mergeLayers(n, layer1, layer2) {
                            const layer2Data = layer2[n];
                            if (layer2Data !== undefined) {
                                const checkLayer1Data = layer1[n];
                                let layer1Data;
                                if (checkLayer1Data !== undefined) {
                                    layer1Data = checkLayer1Data;
                                } else {
                                    layer1Data = {};
                                    layer1[n] = layer1Data;
                                }
                                fillInMissingProps(layer1Data, layer2Data);
                            }
                        }
                        function tryFixData(n) {
                            const newObj = {};
                            for (let cI = 0; cI < layers.length; cI++) {
                                const layer = layers[cI];
                                if (layer === undefined) {
                                    console.warn('!!! LAYER MISSING: ' + cI.toString());
                                    continue;
                                }
                                mergeLayers(n, newObj, layer);
                            }
                            newData[n] = newObj;
                        }
                        tryFixData('details');
                        tryFixData('summary');
                        finalData.push(newData);
                    }
                    const retData = {
                        data: [
                            finalData[getDataIndAtTime(timeInMS, finalData)],
                        ],
                    };
                    res = retData;
                    console.log(res);
                }
                console.log(res);
                resolve({
                    byTime: res,
                    data: data,
                });
            })
            .catch((error) => {
                console.error('error idk: ', error);
                reject(error);
            });
    });
}
function updateData(...args) {
    getData(...args)
        .then((data) => {
            console.log("nosrri", data);
            if (data.byTime === undefined) {
                console.error("!!! DATA OUT OF RANGE !!!");
                return;
            }
            const dataArr = data.byTime.data;
            for (const [periodName, periodData] of Object.entries(dataArr)) {
                for (let i = 0; i < tableRows.length; i++) {
                    const arr = tableRows[i];
                    const dataObj = periodData[arr.source];
                    if (arr.isText === true) {
                        tableElements[arr.name][periodName][arr.textName].innerHTML = '';
                    }
                    if (arr.resetFunc !== undefined) {
                        arr.resetFunc(data, periodName);
                    }
                    if (dataObj !== undefined) {
                        arr.func(data, periodName, dataObj);
                    }
                }
            }
        })
        .catch((error) => {
            console.error('whole thing error: ', error);
        });
}