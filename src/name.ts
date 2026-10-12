import figlet from "figlet";
import boxen from "boxen";

export const showName = async (name: string) : Promise<void> => {
    let newname = await figlet.text(name);
    console.log(boxen(newname, {
        padding: 1 , borderStyle: "classic" ,
        footer: `Welcome to ${name}`, 
        footerAlignment: "center",
    }));    
}