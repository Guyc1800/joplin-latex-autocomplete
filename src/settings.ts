import joplin from "api";
import {MenuItemLocation, SettingItemSubType, SettingItemType} from "api/types";
import {exec} from "child_process";
import * as process from "process";
import {
    ENABLE_ALIGN_WITH_WORD,
    ENABLE_LATEX_INLINE, ENABLE_OUT_OF_STEX,
    LATEX_DICT_LOAD_MENU,
    LATEX_DICTIONARY_MENU,
    LATEX_DICTIONARY_PATH,
    LatexConfig
} from "./common";
import {Hint} from "./codemirror/types";
const fs = require("fs");
const os = require('os');
//common list
export var latexDictionaryObject:Hint[];

export namespace settings{
    const SECTION="autoCompleteSettings"
    export async function register(){
        await joplin.settings.registerSection(SECTION,{label:"latex autocomplete"});
        let PLUGIN_SETTINGS={};
        PLUGIN_SETTINGS[LATEX_DICTIONARY_PATH]= {
            type: SettingItemType.String,
            label: "test",
            public: true,
            section: SECTION,
            subType: SettingItemSubType.FilePath,
            value: "~/.config/joplin-desktop/plugin-data/latexDictionary.json"
        }
        PLUGIN_SETTINGS[ENABLE_LATEX_INLINE]={
            value:true,
            public:true,
            section:SECTION,
            type:SettingItemType.Bool,
            label:"enable inline",
            description:"enable Latex autocomplete even when the cursor is before a letter",
        }
        PLUGIN_SETTINGS[ENABLE_ALIGN_WITH_WORD]={
            value:true,
            public:true,
            section:SECTION,
            type:SettingItemType.Bool,
            label:"align with word",
            description:"Whether the pop-up should be horizontally aligned with the start of the word (true), or with the cursor (false).",
        }
        PLUGIN_SETTINGS[ENABLE_OUT_OF_STEX]={
            value:true,
            public:true,
            section:SECTION,
            type:SettingItemType.Bool,
            label:"enable outside of stex",
            description:"Whether autocomplete should be enabled only inside stex($$ $$) container or not(false).",
        }
        await joplin.settings.registerSettings(PLUGIN_SETTINGS);
    }
    export async function getConfig(){
        const config = new LatexConfig();
        config.latexInline = await joplin.settings.value(ENABLE_LATEX_INLINE);
        config.outsideOfSetx=await joplin.settings.value(ENABLE_OUT_OF_STEX);
        config.alignWithWord=await joplin.settings.value(ENABLE_ALIGN_WITH_WORD);
        config.dictionaryPath=await joplin.settings.value(LATEX_DICTIONARY_PATH);
        return config
    }
    export async function registerMenu(){
        await joplin.commands.register({
            name: "openDictionary",
            label: "open Dictionary",
            execute: async () => {
                const {platform} = process;
                const path = await joplin.settings.value(LATEX_DICTIONARY_PATH);
                if (platform === "linux") {
                    exec('xdg-open ' + path, (error) => console.log(error));
                } else if (platform === "win32") {
                    exec('start ' + path, (error) => console.log(error));
                }
            }
        });
        await joplin.views.menuItems.create(LATEX_DICTIONARY_MENU,"openDictionary",MenuItemLocation.Tools);
        await joplin.commands.register({
            name:"LoadDictionary",
            label:"Load Dictionary",
            execute:async()=>{
                let dictPath=await joplin.settings.value(LATEX_DICTIONARY_PATH);
                if(dictPath.startsWith("~")){
                    dictPath= dictPath.replace("~",os.homedir())
                }
                await fs.readFile(dictPath,(err: any, data: string)=>{
                    console.log(err);
                    latexDictionaryObject= JSON.parse(data);
                });
            }
        });
        await joplin.commands.execute("LoadDictionary")
        await joplin.views.menuItems.create(LATEX_DICT_LOAD_MENU,"LoadDictionary",MenuItemLocation.Tools)
    }
    export async function getDictionary(){
        return latexDictionaryObject;
    }
}

