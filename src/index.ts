import { tokenize } from "./tokenizer/tokenizer";
function test(text: string) {
    console.log(text);
    const result = tokenize(text);
    if (result === undefined) {
        console.log("No tokenization found");
    } else {
        for (const token of result) {
            console.log("   ", token);
        }
    }
}

test("for loop");
test("for(let index: number = 0; index<=3.5 * 2;index++) {}");
