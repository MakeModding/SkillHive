const Weapons = ["Blade", "Hammer", "Fist", "Blood", "Chaos", "Elementalism", "Shotgun", "Pistol", "Rifle"];
const WeaponsLong = ["Blade", "Hammer", "Fist", "Blood Magic Focus", "Chaos Focus", "Elementalism Focus", "Shotgun", "Pistol", "Assault Rifle"];
const SkillLines = [
    ["Method", "Balance", "Technique"],
    ["Brute Force", "Brawn", "Grit"],
    ["Feral", "Instinct", "Primal"],
    ["Profane", "Thaumaturgy", "Sacred"],
    ["Collapse", "Chance", "Building Blocks"],
    ["Resonance", "Disturbance", "Tempest"],
    ["Crackdown", "Control", "Enforce"],
    ["Troubleshooting", "Gunplay", "Bullet Hell"],
    ["Heavy Fire", "Bombardment", "Assault Medic"]
];
const pageTabs = ["ACTIVE_ABILITIES", "PASSIVE_ABILITIES", "BUILDS", "STATS"];
const Pages = ["Active", "Passive", "Build", "Stat"];
const StatPresets = [
    "50-16060-2322-2310-5000-38.13-164.21-7.41-7.41-0-0",
    "50-16060-2322-2310-5000-5.80-60.67-45.65-34.44-0-100",
    "50-16060-2322-2310-5000-38.13-172.71-7.41-7.41-100-0"
];
const svg_ns = 'http://www.w3.org/2000/svg';
const StatNames = ["Level", "Power Rating", "Base Attack", "Base Heal", "Weapon Power", "Crit %", "Crit power %", "Glance %", "Evade %", "Heal Alloc", "Tank Alloc"];
const StatTooltips = [
    "Players level.\nOptional\nDefault:50",
    "Sum of Power Ratings from equipped items\nDefault:0\nE17: 16060",
    "Attack rating from SP/Capstone/Agent/Potions.\n2322+Agents+Potions with all SP/Capstones.\nDefault: 2322",
    "Heal rating from SP/Capstone/Agent/Potions.\n2310+Agents+Potions with all SP/Capstones.\nDefault: 2310",
    "Weapon power of the equipped weapon.\nDefault:0\nE17: 16060",
    "Critical % from character sheet.\nOptional\nDefault: 5.8%",
    "Critical damage % from character sheet\nOptional\nDefault: 60.7%",
    "Glance % from character sheet.\nOptional\nDefault: 7.4%",
    "Evade % from character sheet.\nOptional\nDefault: 5.2%",
    "Heal anima allocation.\n0-100.\nOptional\nDefault: 0",
    "Tank anima allocation.\n0-100.\nOptional\nDefault: 0",
];
const DamageTypes = ["Power", "Basic", "Elite", "All"];
const ParamRegex = new RegExp(/.*?(%[a-zA-Z0]\.{0,1}[0-9]{0,1}f{0,1}).*?/g)
const Premades = [
    ["AR - Dungeon", "DPS", "Tomeee", "https://jimmytherabbit.com/assault-rifle-dungeon/", "b=sb%2BpfLZpl7loVO%2BpUW3oX8loX%3DjzLfkzn2kzR0kzZfkz"],
    ["Blade - Dungeon", "DPS", "JimmyTheRabbit", "https://jimmytherabbit.com/blade-dungeon/", "b=broo%3DF0raG0rU6jz8G0rUW3oTDjz5EjzNEjzFDjzIEjz"],
    ["Blade - DA", "DPS", "JimmyTheRabbit", "https://jimmytherabbit.com/blade-dark-agartha/", "b=broo%3DF0raG0rN92m8G0rRFbqTDjz5EjzNEjzCEjzk6lz"],
    ["Hammer - Dungeon", "DPS", "Steppaz", "https://jimmytherabbit.com/hammer-dungeon/", "b=9Hdoy6bqnE5qH6bqUW3oDo5qzRjzjRjzlRjzkRjzARjz"],
    ["Pistol - Dungeon", "DPS", "JimmyTheRabbit", "https://jimmytherabbit.com/pistol-dungeon/", "b=nYuqcYuqZJDoeYuq5YuqUW3o26mzW0mzU2mzGemzY2mz"],
    ["Pistol - DA", "DPS", "JimmyTheRabbit", "https://jimmytherabbit.com/pistol-dark-agartha/", "b=nYuqcYuqZJDoIYuq5YuqUW3o26mzW0mzB2mzF7mz04lz"],
    ["Hammer/Chaos", "Tank", "JimmyTheRabbit", "https://jimmytherabbit.com/tank-hammer-chaos/", "b=qE5qdVmzD6bq8IdoB6bqNI0rA6nzp4nzARjzwRjzrRjz"],
    ["Shotgun/Chaos", "Tank", "Steppaz", "https://jimmytherabbit.com/tank-shotgun-chaos/", "b=mEjodVmzoK0r7DjzGK0rNI0rWFjzPGjzxFjzp4nzzEjz"],
    ["Fist/Shotgun", "Healer", "Dr-Levsky", "https://jimmytherabbit.com/heal-fist-dungeon/", "b=y93mDvmzvK0roK0rf4vqqFjoVumzUumzbHjzSumzKumz"]
];
var Abilities; //json loaded at startup
var CurrentTab = Weapons[0];
var CurrentPage = Pages[0];
var DragTarget = null;
var Stats = {}

function stripHtml(html) {
    let tmp = document.createElement("DIV");
    html = html.replace(/<br>/g, "&#13;")
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText.replace("  ", " ") || "";
}

function ChangePage(name = CurrentPage, updateUrl = true) {
    UpdateStats();
    CurrentPage = name;
    // Hide other pages + disable events + style page tabs
    let disabledPages = [];
    let active = ""
    for (let i = 0; i < pageTabs.length; i++) {
        let pageName = Pages[i];
        let page = document.getElementById(pageName);
        if (page) {
            if (pageName == CurrentPage) {
                // Set weapon name
                let header = page.querySelector("[id^=WeaponName]")
                if(header) header.getElementsByTagName("tspan")[0].innerHTML = CurrentTab;
                page.setAttribute("opacity", 1)
                page.style.pointerEvents = "auto";
                let tab = document.getElementById(pageTabs[i])
                tab.setAttribute("class", "")
                active = tab;
                let abilitybar = document.getElementById("AbilityBar")
                if (pageName == Pages[3]) {
                    abilitybar.setAttribute("opacity", 0)
                }
                else abilitybar.setAttribute("opacity", 1)
            }
            else {
                page.setAttribute("opacity", 0)
                page.style.pointerEvents = "none"
                let tab = document.getElementById(pageTabs[i]);
                tab.setAttribute("class", "disabledTab")
                disabledPages.push(tab)
            }
        }
    }
    // reorder tabs
    for (let i = 0; i < disabledPages.length; i++) {
        disabledPages[i].parentNode.insertBefore(disabledPages[i], active);
    }

    // Hide detail page on build tab, style on others
    ClearDetails();
    SetDetailVisibility();

    // Style weapon tabs
    for (let weapon of Weapons) {
        if (CurrentTab == weapon) {
            let tab = document.getElementById(weapon);
            tab.setAttribute("class", "")
        }
        else {
            let tab = document.getElementById(weapon)
            tab.setAttribute("class", "disabledTab")
        }
    }

    // Fill skill line names
    let index = Weapons.indexOf(CurrentTab);
    if (CurrentPage == Pages[0]) {
        for (let i = 0; i < 3; i++) {
            let skillLine = document.getElementById("Cell" + i + "Name")
            let tspan = skillLine.getElementsByTagName("tspan")[0]
            tspan.innerHTML = SkillLines[index][i];
            tspan.setAttribute("class", "skillLine");
        }
    }

    // Fill ability slots
    for (let buildref in Abilities[CurrentTab]) {
        let ability = Abilities[CurrentTab][buildref];
        if (ability.Type != CurrentPage) continue;
        let slotName = ability.Type + ability.Row + ability.Column;
        let slot = document.getElementById(slotName);
        slot.ability = ability;

        SetTitle(slot, ability)
        ApplyIconToSlot(slot, slotName, ability, ability.Elite);
        slot.onclick = function () {
            FocusAbility(ability);
        }
        slot.ondblclick = function () {
            if (!IsEquipped(ability)) EquipAbility(ability);
            else UnequipAbilitySlot(GetAbilitySlot(ability));
            $("#tooltip").hide();
        }
        let equipFrame = slot.querySelector("[id^=equipFrame]");
        if (equipFrame) {
            if (IsEquipped(ability)) equipFrame.setAttribute("opacity", 1);
            else equipFrame.setAttribute("opacity", 0);
        }
    }
    if (updateUrl) SetURL();
}

function SetDetailVisibility() {
    let detail = document.getElementById("detailPage");
    if (CurrentPage == Pages[2] || CurrentPage == Pages[3]) {
        detail.setAttribute("opacity", 0)
        detail.style.pointerEvents = "none";
    }
    else {
        detail.setAttribute("opacity", 1)
        detail.style.pointerEvents = "auto";
        let elements = ["DetailCastTime", "DetailCastIcon", "DetailRecastIcon", "DetailRecastTime"];
        let iconslot = document.getElementById(CurrentPage + "DetailSlot");

        if (CurrentPage == Pages[0] && iconslot.ability) {
            for (let ele of elements) {
                document.getElementById(ele).setAttribute("opacity", 1)
            }
        }
        else {
            for (let ele of elements) {
                document.getElementById(ele).setAttribute("opacity", 0)
            }
        }
        if (!iconslot.ability) iconslot.setAttribute("opacity", 0);
        else iconslot.setAttribute("opacity", 1);
    }
}

function GetAbilitySlot(ability) {
    // Gets abilitybar slot of an ability
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById(ability.Type + "Slot" + i);
        try {
            if (abilitySlot.ability == ability) return abilitySlot
        } catch (error) { }
    }
}

function ApplyEquipFrames(ability) {
    // Adds glow around equipped abilities on skillhive
    let slot = document.getElementById(ability.Type + ability.Row + ability.Column);
    let equipFrame = slot.querySelector("[id^=equipFrame]");
    if (IsEquipped(ability)) equipFrame.setAttribute("opacity", 1);
    else equipFrame.setAttribute("opacity", 0);
}

function SetTitle(slot, ability, addname = false) {
    if (ability){
        var delay = function (elem, callback, ability) {
            var timeout = null;
            elem.onmouseover = function() {
                timeout = setTimeout(callback, 300, elem, ability);
            };
            elem.onmouseout = function() {
                clearTimeout(timeout);
                $("#tooltip").hide();
            }
        };
        delay(slot, HoverTooltip, ability);
    }else{
        slot.onmouseover = undefined;
        slot.onmouseout = undefined;
    }
}

function HoverTooltip(slot, ability){
    $("#tooltipcontent").hide();
    let box = slot.getBoundingClientRect();
    let div = document.getElementById("tooltip");
    div.style.left = box.x+"px";
    div.style.top = box.bottom+"px";
    document.getElementById("tooltiptitle").innerHTML = ability.Name;
    document.getElementById("tooltipsubtitle").innerHTML = ability.Type + " Ability";
    document.getElementById("tooltipdescription").innerHTML = ApplyDescription(ability)
    
    $("#tooltip").show(50, function(){
        $("#tooltipcontent").show();
    });
    return false;
}

function IsEquipped(ability) {
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById(ability.Type + "Slot" + i);
        if (!abilitySlot) continue;
        if (abilitySlot.ability == ability) {
            return true;
        }
    }
    return false;
}

function ExportBoo() {
    let booString = "BD%-%VER%-%1.0%-%SK%"
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById("ActiveSlot" + i);
        if (!abilitySlot.ability) booString += "-%undefined%";
        else booString += "-%" + abilitySlot.ability.Id + "%";
    }
    booString += "-%PS%"
    for (let i = 0; i < 5; i++) {
        let abilitySlot = document.getElementById("PassiveSlot" + i);
        if (!abilitySlot.ability) booString += "-%undefined%";
        else booString += "-%" + abilitySlot.ability.Id + "%";
    }
    return booString;
}

function ExportGM() {
    let buildLink = '<a style="text-decoration:none" href="buildref://'
    let buildName = document.getElementById("exportName").value
    buildName = buildName.replace(/[^a-z0-9]/gi, '');
    buildName = buildName || "Build"

    buildLink += buildName + "/"

    let slots = [0, 4, 1, 5, 2, 3];  // Active abilities are not in order
    for (let idx of slots) {
        let abilitySlot = document.getElementById("ActiveSlot" + idx);
        if (abilitySlot.ability) buildLink += abilitySlot.ability.BuildRef + "-"
        else buildLink += "0-";
    }
    buildLink += "0-0-"
    for (let i = 0; i < 5; i++) {
        let abilitySlot = document.getElementById("PassiveSlot" + i);
        if (abilitySlot.ability) buildLink += abilitySlot.ability.BuildRef + "-"
        else buildLink += "0-";
    }
    buildLink += `0-0-0-0-0-0-0-0-0-0-"><font color=#FF0000>[${buildName}]</font></a>`
    return buildLink;
}

function saveFile(name, type, data) {
    if (data != null && navigator.msSaveBlob)
        return navigator.msSaveBlob(new Blob([data], { type: type }), name);
    var a = $("<a style='display: none;'/>");
    var url = window.URL.createObjectURL(new Blob([data], { type: type }));
    a.attr("href", url);
    a.attr("download", name);
    $("body").append(a);
    a[0].click();
    window.URL.revokeObjectURL(url);
    a.remove();
}

function DownloadBuild(idx) {
    let name = document.getElementById("exportName").value || "Build"
    if (idx == 0) {
        let build = document.getElementById("ManagerUrl").value
        saveFile(name, "data:attachment/text", build);
    } else {
        let build = document.getElementById("ManagerShareUrl").value
        saveFile(name + "Share", "data:attachment/text", build);
    }
}

function SetExports() {
    if (document.getElementById("checkboxStats").checked) {
        document.getElementById("BuildUrl").value = window.location.href;
    }
    else {
        let url = new URL(window.location);
        let build = url.searchParams.get("b")
        if (build) {
            let link = url.origin + url.pathname + "?b=" + encodeURIComponent(build);
            document.getElementById("BuildUrl").value = link;
        }
    }
    document.getElementById("BooUrl").value = ExportBoo();
    let GM = ExportGM()
    document.getElementById("ManagerUrl").value = "/text " + GM;
    document.getElementById("ManagerShareUrl").value = GM;
}

function ApplyUrl() {
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById("ActiveSlot" + i);
        UnequipAbilitySlot(abilitySlot, false);
    }
    for (let i = 0; i < 5; i++) {
        let abilitySlot = document.getElementById("PassiveSlot" + i);
        UnequipAbilitySlot(abilitySlot, false);
    }
    for (let i = 0; i < 11; i++) {
        let input = document.getElementById("Stats" + i).getElementsByTagName("input")[0];
        input.value = "";
    }
    for (let weap of Weapons) {
        for (let dmg of DamageTypes) {
            let input = document.getElementById(weap + dmg).getElementsByTagName("input")[0];
            input.value = "";
        }
    }
    let input = document.getElementById("AoE").getElementsByTagName("input")[0];
    input.value = "";

    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    for (let param of urlParams) {
        let key = param[0];
        let value = param[1];
        if (key == "b") {
            let abilities = SplitAbilities(value);
            for (let i = 0; i < abilities.length; i++) {
                for (let weapon of Weapons) {
                    if (abilities[i] == "0000") continue;
                    let ability = Abilities[weapon][abilities[i]];
                    if (ability) {
                        let abilitySlot;
                        if (ability.Type == Pages[0]) abilitySlot = document.getElementById(ability.Type + "Slot" + i);
                        else abilitySlot = document.getElementById(ability.Type + "Slot" + (Number(i) - 6));
                        UnequipAbilitySlot(abilitySlot, false);
                        EquipToSlot(ability, abilitySlot, false);
                        break;
                    }
                }
            }
        }
        else if (key == "i") {
            CurrentPage = Pages[Number(value.charAt(0))]
            CurrentTab = Weapons[Number(value.charAt(1))]
        }
        else if (key == "s") {
            let stats = value.split("-");
            for (let i = 0; i < 11; i++) {
                let input = document.getElementById("Stats" + i).getElementsByTagName("input")[0];
                input.value = stats[i];
            }
        }
        else if (key == "a") {
            let stats = value.split("-");
            for (let i = 0; i < stats.length; i++) {
                let ele;
                if (stats[i].slice(0, 2) == "AA") ele = document.getElementById("AoE");
                else ele = document.getElementById(Weapons[stats[i].charAt(0)] + DamageTypes[stats[i].charAt(1)]);
                let input = ele.getElementsByTagName("input")[0];
                input.value = stats[i].slice(2)
            }
        }
    }
    ChangePage(undefined, false);
    UpdateStats();
    SetExports();
}

function SetURL() {
    let url = new URL(location.protocol + '//' + location.host + location.pathname);
    let buildString = ""
    let found = false;
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById("ActiveSlot" + i);
        if (!abilitySlot.ability) buildString += "0000"
        else {
            found = true
            buildString += abilitySlot.ability.BuildRef;
        }
    }
    for (let i = 0; i < 5; i++) {
        let abilitySlot = document.getElementById("PassiveSlot" + i);
        if (!abilitySlot.ability) buildString += "0000"
        else {
            found = true
            buildString += abilitySlot.ability.BuildRef;
        }
    }
    if (found) url.searchParams.append("b", buildString)
    url.searchParams.append("i", String(Pages.indexOf(CurrentPage)) + Weapons.indexOf(CurrentTab));

    let stats = [];
    let Found = false;
    for (let i = 0; i < 11; i++) {
        let input = document.getElementById("Stats" + i).getElementsByTagName("input")[0];
        let value = Number(input.value) || "";
        stats.push(value)
        if (value) Found = true
    }
    if (Found) url.searchParams.append("s", stats.join("-"));

    stats = [];
    Found = false;
    for (let i in Weapons) {
        for (let y in DamageTypes) {
            let stat = document.getElementById(Weapons[i] + DamageTypes[y]);
            let input = stat.getElementsByTagName("input")[0];
            let value = Number(input.value)
            if (value) {
                Found = true
                stats.push(String(i) + y + value);
            }
        }
    }
    let stat = document.getElementById("AoE");
    let input = stat.getElementsByTagName("input")[0];
    let value = Number(input.value)
    if (value) {
        Found = true;
        stats.push("AA" + value);
    }
    if (Found) url.searchParams.append("a", stats.join("-"));
    UpdateStats();
    window.history.replaceState(null, null, url);
    SetExports();
}

function SplitAbilities(value) {
    let chunks = [];
    for (let i = 0, charsLength = value.length; i < charsLength; i += 4) {
        chunks.push(value.substring(i, i + 4));
    }
    return chunks
}

function CanEquip(ability) {
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById(ability.Type + "Slot" + i);
        if (!abilitySlot) continue;
        if (!abilitySlot.ability) continue;
        if (abilitySlot.ability == ability) {
            let icon = abilitySlot.querySelector("[id^=iconClip]");
            icon.setAttribute("class", "conflict");
            setTimeout(() => {
                icon.setAttribute("class", "");
            }, 1500);
            return false;
        }
        else if (abilitySlot.ability.Basic && ability.Basic) {
            let icon = abilitySlot.querySelector("[id^=iconClip]");
            icon.setAttribute("class", "conflict");
            setTimeout(() => {
                icon.setAttribute("class", "");
            }, 1500);
            return false;
        }
        else if (abilitySlot.ability.Elite && ability.Elite) {
            let icon = abilitySlot.querySelector("[id^=iconClip]");
            icon.setAttribute("class", "conflict");
            setTimeout(() => {
                icon.setAttribute("class", "");
            }, 1500);
            return false;
        }
    }
    return true;
}

function UnequipAbilitySlot(abilitySlot, setUrl = true) {
    let ability = abilitySlot.ability
    delete abilitySlot.ability;
    let x = abilitySlot.getElementsByTagNameNS(svg_ns, "image");
    let i = x.length;
    while (i--) {
        x[i].remove();
    }
    let icon = abilitySlot.querySelector("[id^=iconClip]");
    icon.setAttribute("opacity", 0);
    if (setUrl) SetURL();
    SetTitle(abilitySlot, null);
    if (ability) ApplyEquipFrames(ability);
}

function UnequipAbility(ability, setUrl) {
    for (let i = 0; i < 6; i++) {
        let slot = document.getElementById("ActiveSlot" + i);
        if (slot.ability == ability) {
            UnequipAbilitySlot(slot, setUrl);
            return;
        }
    }
    for (let i = 0; i < 5; i++) {
        let slot = document.getElementById("PassiveSlot" + i);
        if (slot.ability == ability) {
            UnequipAbilitySlot(slot, setUrl);
            return;
        }
    }
}

function EquipAbility(ability, setUrl = true) {
    if (!CanEquip(ability)) return;
    for (let i = 0; i < 6; i++) {
        let abilitySlot = document.getElementById(ability.Type + "Slot" + i);
        if (!abilitySlot) continue;
        if (!abilitySlot.ability) {
            EquipToSlot(ability, abilitySlot, setUrl)
            return;
        }
    }
}

function EquipToSlot(ability, slot, setUrl) {
    ApplyIconToSlot(slot, null, ability, ability.Elite)
    slot.ability = ability;
    let icon = slot.querySelector("[id^=iconClip]");
    icon.setAttribute("opacity", 1);
    let equipFrame = slot.querySelector("[id^=equipFrame]");
    equipFrame.setAttribute("opacity", 0);
    SetTitle(slot, ability)
    slot.onclick = function () {
        FocusAbility(ability);
    }
    slot.ondblclick = function () {
        UnequipAbilitySlot(slot);
        $("#tooltip").hide();
        $("#tooltip").hide();
    }
    if (setUrl) SetURL();
    ApplyEquipFrames(ability);
}

function ChangeTab(target) {
    CurrentTab = target;
    ChangePage();
}

function ClearDetailBG() {
    let BGs = ["EliteBG", "MagicBG", "BuilderBG", "ConsumerBG", "PassiveBG"];
    for (let bg of BGs) {
        document.getElementById(bg).setAttribute("opacity", 0)
    }
}

function ClearDetails() {
    let iconSlot = document.getElementById(CurrentPage + "DetailSlot");
    if (iconSlot) {
        delete iconSlot.ability;
        ClearImages(iconSlot);
        SetTitle(iconSlot, null);
    }

    let ele = document.getElementById("DetailCastTime");
    ele.innerHTML = "";
    ele = document.getElementById("DetailRecastTime");
    ele.innerHTML = "";
    ele = document.getElementById("DetailDescription");
    ele.innerHTML = "";
    ele = document.getElementById("DetailAbilityType");
    ele.innerHTML = "";
    ele = document.getElementById("DetailName");
    ele.innerHTML = "";
    ClearDetailBG();
}

function FocusAbility(ability) {
    ClearDetailBG();
    let iconSlot = document.getElementById(ability.Type + "DetailSlot");
    if (CurrentPage != ability.Type) return;
    if (iconSlot.ability == ability) {
        ClearDetails();
        return;
    }

    ApplyIconToSlot(undefined, CurrentPage + "DetailSlot", ability);

    // Set ability name
    let ele = document.getElementById("DetailName");
    ele.innerHTML = ""
    let renderer = new Highcharts.Renderer(ele, 200, 30);
    renderer.text(ability.Name, 0, 20).add()

    // Set ability type
    ele = document.getElementById("DetailAbilityType");
    ele.innerHTML = ""
    renderer = new Highcharts.Renderer(ele, 200, 30);

    let longName = WeaponsLong[
        Weapons.indexOf(ability.Weapon)
    ];
    if (ability.Basic) {
        renderer.text(longName + " Basic Ability", 0, 20).add()
        document.getElementById("BuilderBG").setAttribute("opacity", 1)
    }
    else if (ability.Power) {
        renderer.text(longName + " Power Ability", 0, 20).add();
        document.getElementById("ConsumerBG").setAttribute("opacity", 1);
    }
    else if (ability.Special) {
        renderer.text(longName + " Special Ability", 0, 20).add()
        document.getElementById("MagicBG").setAttribute("opacity", 1);
    }
    else if (ability.Elite) {
        renderer.text(longName + " Elite Ability", 0, 20).add()
        document.getElementById("EliteBG").setAttribute("opacity", 1);
    } else {
        document.getElementById("PassiveBG").setAttribute("opacity", 1)
    }

    // set cast time
    ele = document.getElementById("DetailCastTime");
    ele.innerHTML = "";
    renderer = new Highcharts.Renderer(ele, 200, 30);
    if (ability.CastTime) renderer.text(Number(ability.CastTime).toFixed(1), 0, 9).add()
    else renderer.text("Instant", 0, 9).add()

    // set cooldown
    ele = document.getElementById("DetailRecastTime");
    ele.innerHTML = ""
    renderer = new Highcharts.Renderer(ele, 200, 30);
    if (ability.Cooldown) renderer.text(Number(ability.Cooldown).toFixed(1), 0, 9).add()
    else renderer.text("Instant", 0, 9).add()

    // set description
    ele = document.getElementById("DetailDescription");
    ele.innerHTML = "";
    renderer = new Highcharts.Renderer(ele, 400, 550);
    renderer.text(ApplyDescription(ability), 10, 20).css({ width: "247px" }).add();
    SetDetailVisibility();
}


function UpdateStats() {
    Stats = {}
    Stats["Level"] = Number(document.getElementById("Stats0").getElementsByTagName("input")[0].value) || 50;
    Stats["PowerRating"] = Number(document.getElementById("Stats1").getElementsByTagName("input")[0].value) || 0;
    let BaseAttack = Number(document.getElementById("Stats2").getElementsByTagName("input")[0].value) || 2322;
    let BaseHeal = Number(document.getElementById("Stats3").getElementsByTagName("input")[0].value) || 2310;

    BaseAttack += Stats["Level"] * 40;
    BaseHeal += Stats["Level"] * 40;


    Stats["WeaponPower"] = Number(document.getElementById("Stats4").getElementsByTagName("input")[0].value) || 0;
    Stats["Crit"] = Number(document.getElementById("Stats5").getElementsByTagName("input")[0].value) || 5.804;
    Stats["Crit"] = Stats["Crit"] / 100
    Stats["CritDamage"] = Number(document.getElementById("Stats6").getElementsByTagName("input")[0].value) || 60.6688;
    Stats["CritDamage"] = Stats["CritDamage"] / 100
    Stats["Defense"] = Number(document.getElementById("Stats7").getElementsByTagName("input")[0].value) || 7.403;
    Stats["Evade"] = Number(document.getElementById("Stats8").getElementsByTagName("input")[0].value) || 5.1763;
    Stats["HealAlloc"] = Number(document.getElementById("Stats9").getElementsByTagName("input")[0].value) || 0;
    Stats["TankAlloc"] = Number(document.getElementById("Stats10").getElementsByTagName("input")[0].value) || 0;

    Stats["AttackProfiency"] = Stats["PowerRating"] * (100 - Stats["HealAlloc"] - Stats["TankAlloc"]) / 100 + BaseAttack;
    Stats["HealProfiency"] = Stats["PowerRating"] * 0.8 * Stats["HealAlloc"] / 100 + BaseHeal;

    Stats["CombatPower"] = 0.075 * (Stats["AttackProfiency"] + Stats["WeaponPower"]);
    Stats["HealPower"] = 0.02 * (Stats["HealProfiency"] + Stats["WeaponPower"]);
    Stats["LeechPower"] = Stats["HealPower"] / 7.5;
    Stats["CritChanceHeal"] = 0;
    Stats["CritDamageRating"] = 0;

    let display = document.getElementById("CombatDisplay").getElementsByTagName("tspan")[0];
    display.innerHTML = Stats.CombatPower.toFixed(1);
    display = document.getElementById("HealDisplay").getElementsByTagName("tspan")[0];
    display.innerHTML = Stats.HealPower.toFixed(1);

    for (let weap of Weapons) {
        for (let y in DamageTypes) {
            let input = Number(document.getElementById(weap + DamageTypes[y]).getElementsByTagName("input")[0].value);
            Stats[weap + [DamageTypes[y]]] = input / 100;
        }
    }
    let input = Number(document.getElementById("AoE").getElementsByTagName("input")[0].value);
    Stats["AoE"] = input / 100;
}

function ApplyDescription(ability) {
    let description = ability.Description;
    let params = ability.Params;
    let s = Stats;
    let matches = [...description.matchAll(ParamRegex)]
    for (let i in matches) {
        let format = matches[i][1];
        let value = eval('`' + params[i] + '`');
        value = eval(value);
        if (format == "%i") {
            description = description.replace(format, Math.round(value));
        }
        else if (format == "%0.2f") {
            description = description.replace(format, value.toFixed(2));
        }
        else if (format == "%0.1f") {
            description = description.replace(format, value.toFixed(1));
        }
        else if (format == "%0.0f") {
            description = description.replace(format, value.toFixed(0));
        }
    }
    return description
}

function ClearImages(slot) {
    let x = slot.getElementsByTagNameNS(svg_ns, "image")
    let i = x.length;
    while (i--) {
        x[i].remove();
    }
}

function ApplyIconToSlot(slot, slotName, ability, elite) {
    if (!slot) slot = document.getElementById(slotName);
    ClearImages(slot);
    slot.ability = ability

    // Show elite frame
    let eliteframe = slot.querySelector('[id^="eliteFrame"]');
    if (eliteframe) {
        if (elite) eliteframe.setAttribute("opacity", 1)
        else eliteframe.setAttribute("opacity", 0)
    }

    // set ability name
    let name = slot.querySelector('[id^="Name"]')
    if (name) {
        name.innerHTML = ""
        let renderer = new Highcharts.Renderer(name, 155, 60, undefined, undefined, true, false);
        renderer.styledMode = false
        let xoffset = CurrentPage == Pages[0] ? 70 : 70;
        let yoffset = CurrentPage == Pages[0] ? 35 : 30;
        output = renderer.text(
            ability.Name, xoffset, yoffset)
            .css({ width: "130px" })
            .attr({
                'dominant-baseline': 'center',
                'text-anchor': 'middle'
            })
            .add()
            .shadow(true);
        let lines = name.getElementsByTagName("tspan")
        if (lines.length == 1) {
            output.element.setAttribute("y", yoffset - 15);
        }
        if (CurrentPage == Pages[0]) {
            if (ability.Power) name.setAttribute('class', 'Consumer');
            else if (ability.Special) name.setAttribute('class', 'Magic');
            else if (ability.Elite) name.setAttribute('class', 'Elite');
            else name.setAttribute('class', 'Builder');
        }
        else name.setAttribute('class', 'Passive');
    }

    // Load svg image to ability clip
    let frame = slot.querySelector('[id^="border"]');
    let el = document.createElementNS(svg_ns, 'image');
    el.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "images/" + ability.IconId + ".svg");
    el.setAttribute('x', 1);
    el.setAttribute('y', 1);
    el.setAttribute('width', 55);
    el.setAttribute('height', 55);
    el.setAttribute('class', 'ability');
    el.setAttribute("draggable", true)
    frame.parentNode.insertBefore(el, frame);
}

function GrabAbility(evt) {
    if (evt.button == 2) return;
    var targetElement = evt.target;
    while (targetElement.parentNode) {
        if (targetElement.className.baseVal == "abilitySlot" || targetElement.className.baseVal == "barSlot") break;
        targetElement = targetElement.parentNode;
    }
    if (!targetElement.parentNode || !targetElement.ability) {
        if (DragTarget) {
            DragTarget.remove();
            DragTarget.setAttributeNS(null, 'pointer-events', 'all');
        }
        DragTarget = null;
        return;
    }

    DragTarget = targetElement.cloneNode(true);
    DragTarget.ability = targetElement.ability;
    targetElement.parentNode.appendChild(DragTarget)
    let abilityName = DragTarget.querySelector("g[id^=Name]");
    if (abilityName) abilityName.remove();
    DragTarget.setAttributeNS(null, 'pointer-events', 'none');

    var pnt = DragTarget.ownerSVGElement.createSVGPoint();
    pnt.x = evt.clientX;
    pnt.y = evt.clientY;
    //---elements transformed and/or in different(svg) viewports---
    var sCTM = DragTarget.getScreenCTM();
    var Pnt = pnt.matrixTransform(sCTM.inverse());

    TransformRequestObj = DragTarget.ownerSVGElement.createSVGTransform()
    //---attach new or existing transform to element, init its transform list---
    var myTransListAnim = DragTarget.transform
    TransList = myTransListAnim.baseVal

    OffsetX = Pnt.x
    OffsetY = Pnt.y
};


function DragAbility(evt) {
    if (DragTarget) {
        var pnt = DragTarget.ownerSVGElement.createSVGPoint();
        pnt.x = evt.clientX;
        pnt.y = evt.clientY;
        //---elements in different(svg) viewports, and/or transformed ---
        var sCTM = DragTarget.getScreenCTM();
        var Pnt = pnt.matrixTransform(sCTM.inverse());
        Pnt.x -= OffsetX;
        Pnt.y -= OffsetY;

        TransformRequestObj.setTranslate(Pnt.x, Pnt.y)
        TransList.appendItem(TransformRequestObj)
        TransList.consolidate()
    }
};

function TryToSlot(ability, slot, setUrl) {
    if (ability.Type == Pages[0] && slot.id.startsWith("Active")) {
        let allowed = CanEquip(ability);
        if (allowed) {
            if (slot.ability) UnequipAbilitySlot(slot, false);
            EquipToSlot(ability, slot, setUrl);
        }
    }
    else if (ability.Type == Pages[1] && slot.id.startsWith("Passive")) {
        let allowed = CanEquip(ability);
        if (allowed) {
            if (slot.ability) UnequipAbilitySlot(slot, false);
            EquipToSlot(ability, slot, setUrl);
        }
    }
}

function GetSlot(ability) {
    for (let i = 0; i < 6; i++) {
        let slot = document.getElementById("ActiveSlot" + i);
        if (slot.ability == ability) return slot;
    }
    for (let i = 0; i < 5; i++) {
        let slot = document.getElementById("PassiveSlot" + i);
        if (slot.ability == ability) return slot;
    }
}

function DropAbility(evt) {
    if (DragTarget) {
        var targetElement = evt.target;
        while (targetElement.parentNode) {
            if (targetElement.className.baseVal == "abilitySlot" ||
                targetElement.className.baseVal == "barSlot" ||
                targetElement.id == "AbilityDrop") break;
            targetElement = targetElement.parentNode;
        }
        if (targetElement.id == "AbilityDrop" || // prevent accidental unequip
            DragTarget.ability == targetElement.ability || // cant drop on self
            (!targetElement.parentNode && DragTarget.className.baseVal == "abilitySlot") // cant drop on random things
        ) {
        }
        else if (!targetElement.parentNode && DragTarget.className.baseVal == "barSlot") {
            // Dropped ability off the bar
            UnequipAbility(DragTarget.ability, true);
        }
        else if (targetElement.className.baseVal == "abilitySlot" && DragTarget.className.baseVal == "abilitySlot") {
            // cant swap ability page abilities...
        }
        else if (DragTarget.className.baseVal == "barSlot" && targetElement.className.baseVal == "abilitySlot") {
            // probably tried to drop ability off
            UnequipAbility(DragTarget.ability, true);
        }
        else if (DragTarget.className.baseVal == "abilitySlot" && targetElement.className.baseVal == "barSlot") {
            // equip
            TryToSlot(DragTarget.ability, targetElement, true);
        }
        else if (DragTarget.className.baseVal == targetElement.className.baseVal) {
            // switching slots
            if (DragTarget.id.substring(0, 5) == targetElement.id.substring(0, 5)) { // Prevent mixing actives and passives
                let ability1 = DragTarget.ability;
                let ability2 = targetElement.ability;
                let slot = GetSlot(ability1);
                UnequipAbility(ability1, false);
                if (!ability2) {
                    TryToSlot(ability1, targetElement, true);
                }
                else {
                    UnequipAbility(ability2, false);
                    TryToSlot(ability1, targetElement, false);
                    TryToSlot(ability2, slot, true);
                }
            }
        }
        DragTarget.remove();
        DragTarget = null;
    }
};

function Loadfiles() {
    if (!Abilities) {
        $.getJSON("abilities.json", function (json) {
            Abilities = json;
            ApplyUrl();
            document.getElementById("content").style = "";
        });
    }
}


function Hook() {
    // weapon tabs
    for (let i = 0; i < Weapons.length; i++) {
        let weapon = Weapons[i];
        document.getElementById(Weapons[i]).onclick = function () {
            ChangeTab(weapon);
        }
    }
    // page tabs
    for (let i = 0; i < pageTabs.length; i++) {
        let tabName = pageTabs[i];
        let pageName = Pages[i];

        let tab = document.getElementById(tabName);
        tab.onclick = function () {
            ChangePage(pageName)
        }
        let x = tab.querySelector("tspan");
        x.textContent = tabName.replace("_", " ");
    }
    // Drag and drop support for abilities
    for (let i = 0; i < 6; i++) {
        let slot = document.getElementById("ActiveSlot" + i);
        slot.setAttribute("class", "barSlot");
    }
    for (let i = 0; i < 5; i++) {
        let slot = document.getElementById("PassiveSlot" + i);
        slot.setAttribute("class", "barSlot");
    }
    for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 3; row++) {
            let slot = document.getElementById("Active" + row + col);
            slot.setAttribute("class", "abilitySlot");
        }
    }
    for (let col = 0; col < 10; col++) {
        for (let row = 0; row < 6; row++) {
            let slot = document.getElementById("Passive" + row + col);
            if (!slot) continue;
            slot.setAttribute("class", "abilitySlot");
        }
    }

    // Decs
    for (let i = 0; i < 10; i++) {
        let slotName = "DeckSlot_" + i;
        let buildSlot = document.getElementById(slotName);
        let foreigner = document.createElementNS(svg_ns, "foreignObject");
        foreigner.setAttribute("x", 14);
        foreigner.setAttribute("y", 8);
        foreigner.setAttribute("width", 250);
        foreigner.setAttribute("height", 30);
        buildSlot.appendChild(foreigner);

        let txt = document.createElement('input');
        let buildName = localStorage.getItem(slotName + "Name");
        if (buildName) buildName = decodeURIComponent(buildName);
        else buildName = "Build " + (i + 1);
        txt.setAttribute("value", buildName);
        foreigner.appendChild(txt);

        let saveButton = buildSlot.querySelector("[id^=SaveButton]")
        saveButton.onclick = function () {
            localStorage.setItem(slotName + "Name", encodeURIComponent(txt.value));
            localStorage.setItem(slotName + "Build", encodeURIComponent(window.location.search));
            saveButton.setAttribute("class", "apply");
            setTimeout(() => {
                saveButton.setAttribute("class", "");
            }, 750);
        }

        let loadButton = buildSlot.querySelector("[id^=EquipButton]")
        loadButton.onclick = function () {
            let build = localStorage.getItem(slotName + "Build");
            if (build) {
                let url = new URL(location.protocol + '//' + location.host + location.pathname);
                url += decodeURIComponent(build);
                window.history.replaceState(null, null, url);
                ApplyUrl();
                loadButton.setAttribute("class", "apply");
                setTimeout(() => {
                    loadButton.setAttribute("class", "");
                }, 750);
            }
        }
        let deletebutton = buildSlot.querySelector("[id^=DeleteButton]")
        deletebutton.onclick = function () {
            localStorage.removeItem(slotName + "Build");
            localStorage.removeItem(slotName + "Name");
            txt.value = "Build " + (i + 1);
        }
    }

    // Premade decks
    let base = document.getElementById("Premade0");
    for (let i in Premades) {
        let clip;
        if (i != 0) {
            clip = base.cloneNode(true);
            base.parentNode.append(clip);
            let x = base.transform.baseVal[0].matrix.e;
            let y = base.transform.baseVal[0].matrix.f;
            var matrix = Skillhive.createSVGMatrix();
            matrix = matrix.translate(x, y + 30);
            clip.transform.baseVal.getItem(0).setMatrix(matrix);
            clip.id = "Premade" + i;
            base = clip;
        }
        else clip = base;
        let ele = base.querySelector("[id^=Name]");
        ele.getElementsByTagName("tspan")[0].innerHTML = Premades[i][0];

        ele = base.querySelector("[id^=Credit]");
        ele.getElementsByTagName("tspan")[0].innerHTML = Premades[i][2];

        let icons = ["Tank", "DPS", "Healer"];
        for (let icon of icons) {
            ele = base.querySelector(`[id^=${icon}]`);
            if (Premades[i][1] == icon) ele.setAttribute("opacity", 1)
            else ele.setAttribute("opacity", 0)
        }
        clip.onclick = function (evt) {
            let url = new URL(`${location.protocol}//${location.host}${location.pathname}?${Premades[i][4]}`)
            window.history.replaceState(null, null, url);
            ApplyUrl();
        }
        let link = base.querySelector("[id^=Link]");
        if (Premades[i][3] != "") {
            link.setAttribute("opacity", 1);
            link.onclick = function (evt) {
                window.open(Premades[i][3], "_blank").focus()
            }
        }
        else {
            link.setAttribute("opacity", 0);
            link.onclick = undefined;
        }
    }

    // Stats
    let inputs = []
    inputs.push(document.getElementById("AoE"));
    for (let weap of Weapons) {
        for (let dmg of DamageTypes) {
            let input = document.getElementById(weap + dmg);
            inputs.push(input);
        }
    }
    for (let input of inputs) {
        let foreigner = document.createElementNS(svg_ns, "foreignObject");
        foreigner.setAttribute("x", 0);
        foreigner.setAttribute("y", -3);
        foreigner.setAttribute("width", 30);
        foreigner.setAttribute("height", 20);
        input.appendChild(foreigner);

        let txt = document.createElement('input');
        txt.setAttribute("maxlength", 6);

        txt.addEventListener('input', function () {
            this.value = this.value.replace(",", ".");
            this.value = this.value.replace(/[^\d.]+/g, '');
            SetURL();
        }, true);
        foreigner.appendChild(txt);
    }

    // Attributes
    for (let i = 0; i < 11; i++) {
        let input = document.getElementById("Stats" + i);

        let el = document.createElementNS(svg_ns, "title");
        el.setAttribute('class', 'tooltip');
        el.textContent = StatTooltips[i];
        input.querySelector("[id^=Help]").appendChild(el)

        let name = input.querySelector("[id^=Name]")
        name.getElementsByTagName("tspan")[0].innerHTML = StatNames[i];

        let foreigner = document.createElementNS(svg_ns, "foreignObject");
        foreigner.setAttribute("x", 220);
        foreigner.setAttribute("y", 0);
        foreigner.setAttribute("width", 175);
        foreigner.setAttribute("height", 40);
        input.appendChild(foreigner);

        let txt = document.createElement('input');
        txt.setAttribute("maxlength", 6);

        txt.addEventListener('input', function () {
            this.value = this.value.replace(",", ".");
            this.value = this.value.replace(/[^\d.]+/g, '');
            SetURL();
        }, true);
        foreigner.appendChild(txt);
    }


    // Stat Slots
    for (let i = 0; i < 6; i++) {
        let slotName = "StatSlot" + i;
        let statSlot = document.getElementById(slotName);
        let foreigner = document.createElementNS(svg_ns, "foreignObject");
        foreigner.setAttribute("x", 16);
        foreigner.setAttribute("y", 8);
        foreigner.setAttribute("width", 250);
        foreigner.setAttribute("height", 30);
        statSlot.appendChild(foreigner);

        let txt = document.createElement('input');
        let StatName = localStorage.getItem(slotName + "Name");
        if (StatName) StatName = decodeURIComponent(StatName);
        else StatName = "Stats " + (i + 1);
        txt.setAttribute("value", StatName);
        foreigner.appendChild(txt);

        let saveButton = statSlot.querySelector("[id^=SaveButton]")
        saveButton.onclick = function () {
            var url = new window.URL(document.location);
            localStorage.setItem(slotName + "Name", encodeURIComponent(txt.value));
            localStorage.setItem(slotName + "Stats", encodeURIComponent(url.searchParams.get('s')));
            localStorage.setItem(slotName + "Buffs", encodeURIComponent(url.searchParams.get('a')));
            saveButton.setAttribute("class", "apply");
            setTimeout(() => {
                saveButton.setAttribute("class", "");
            }, 750);
        }

        let loadButton = statSlot.querySelector("[id^=EquipButton]")
        loadButton.onclick = function () {
            let stats = localStorage.getItem(slotName + "Stats");
            let changed = false;
            if (stats) {
                changed = true;
                var url = new window.URL(document.location);
                url.searchParams.set('s', stats);
                window.history.replaceState(null, null, url);
                loadButton.setAttribute("class", "apply");
                setTimeout(() => {
                    loadButton.setAttribute("class", "");
                }, 750);
            }
            let buffs = localStorage.getItem(slotName + "Buffs");
            if (buffs) {
                changed = true;
                var url = new window.URL(document.location);
                url.searchParams.set('a', buffs);
                window.history.replaceState(null, null, url);
                loadButton.setAttribute("class", "apply");
                setTimeout(() => {
                    loadButton.setAttribute("class", "");
                }, 750);
            }

            if (changed) ApplyUrl();
        }
        let deletebutton = statSlot.querySelector("[id^=DeleteButton]")
        deletebutton.onclick = function () {
            localStorage.removeItem(slotName + "Stats");
            localStorage.removeItem(slotName + "Name");
            txt.value = "Stats " + (i + 1);
        }
    }

    // presets
    let presets = ["StatDPS", "StatTank", "StatHealer"];
    let icons = ["DPS", "Tank", "Healer"]
    for (let i in presets) {
        let preset = document.getElementById(presets[i]);
        for (let y in icons) {
            let icon = preset.querySelector(`[id^=${icons[y]}]`)
            if (y == i) icon.setAttribute("opacity", 1)
            else icon.setAttribute("opacity", 0);
        }
        let name = preset.querySelector("[id^=Name]")
        name.getElementsByTagName("tspan")[0].innerHTML = icons[i];
        preset.onclick = function () {
            var url = new window.URL(document.location);
            url.searchParams.set('s', StatPresets[i]);
            window.history.replaceState(null, null, url);
            ApplyUrl();
        }
    }

    //Reset
    let reset = document.getElementById("resetButton");
    reset.onclick = function (evt) {
        let url = new URL(location.protocol + '//' + location.host + location.pathname);
        window.history.replaceState(null, null, url);
        ApplyUrl();
    }

    // one time select for textareas
    var areas = document.getElementsByTagName('textarea');
    for(let area of areas){
        let clicked = false;
        area.addEventListener('click', function () {
            if (!clicked) {
                area.select();
                clicked = true;
            }
        });

        area.addEventListener('blur', function () {
            clicked = false;
        }); 
    }

    // drag&drop
    Skillhive = document.getElementById("Skillhive")
    Skillhive.onmousedown = GrabAbility;
    Skillhive.onmousemove = DragAbility;
    Skillhive.onmouseup = DropAbility;
    Loadfiles();
}