import { showName } from "./name.js"
import { select } from '@inquirer/prompts'
import { buildPkgJson } from "./pkg.js"

const main = async () => {
    await showName("NEOVA")
    const type = await select({message : "What do you want ?" , choices: ["cjs" , "esm"]})
    console.log("type is :",type);
    buildPkgJson(type) 
}

main()