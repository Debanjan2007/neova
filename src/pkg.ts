// build package.js 
import { exec } from "node:child_process"
import ora from 'ora';

export const buildPkgJson = (type: "cjs" | "esm"): void => {
    if (type === "cjs") {
        const spinner = ora('Loading unicorns').start();
        setTimeout(() => {
            spinner.color = 'yellow';
            spinner.text = 'creating package.json';
        }, 100);
        exec('npm init -y', {
            windowsHide: true
        }, (err) => {
            if (err) {
                console.log(err.message);
                Promise.reject(err?.stack)
            }
        })
        return
    }
    const spinner = ora('Loading unicorns').start();
    setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = 'creating package.json';
    }, 100);
    exec("npm init es6 -y", {
        windowsHide: true
    }, (err) => {
        if (err) {
            console.log(err.message);
            Promise.reject(err?.stack)
        }
    })
    return
}