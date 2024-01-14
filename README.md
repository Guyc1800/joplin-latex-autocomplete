# Latex AutoComplete
this plugin provide autocomplete for latex in joplin.
## Install
1. download the [plugin](./publish/com.latexAutocomplete.jpl);
2. open joplin > settings > Plugins > Manage your plugins > install from file.
3. choose the file u just downloaded.

for the plugin to work u need dictionary file, you can make your own or use the [provided](./src/latexDictionary.json)
4. go to joplin > settings > latex autocomplete and click browse to choose the dictionary file location.
5. go back to the editor and click on menu > tools > Load dictionary, after that hit F5 while cursor inside the editor
this will update the dictionary of the completions.




## features
### custom dictionary file
you can edit the dictionary file to add or remove completions.  
1. click on the menu > tools > open dictionary to edit the dictionary file to fit your own needs,  
2. now load the dictionary using "load dictionary" and f5 as mentioned in the installation (5).
the data structure for the json file is a list of objects(Hints)
```
Hint { 
   text: string; //the completion output
   displayText?: string; // the completion index and the text that is shown on the left
   description?: string; // a short description for each complete item (on the right)
   inline: boolean;// whether the output is inline or should add new line before and after the output
}
```

for example:
```
[
    {
        "text":"\\begin{equation}\n\\end{equation}",
        "displayText":"\\equation",
        "description":"env cont li",
        "inline":false
    }
]
```
### custom settings
1. "enable inline"- enable/disable latex auto complete when there is a letter after the cursor.
2. "align with word"-Whether the pop-up should be horizontally aligned with the start of the word (true, default), or with the cursor (false).
3. "enable outside of stex"- Whether the autocomplete should be enabled only inside stex container($$ $$) everywhere(false).
### keybinds 
1. "Ctrl-Space" - trigger the autocomplete. 
2. "esc" - close autocomplete popup
3. arrows - choose completion.
4. write "\\" to trigger the autocompletion.
### TODOs
- [ ] after completion ends move the cursor between all the {} to write and move between them using tab
- [ ] add history management to show last used completions when there is now trigger symbol.
