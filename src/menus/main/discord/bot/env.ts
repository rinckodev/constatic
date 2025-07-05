import { EnvEditor, modifyObjArg } from "#helpers";
import { EnvVarData } from "#types";
import { SourceFile } from "ts-morph";

export async function updateEnv(
    sourceFile: SourceFile,
    editor: EnvEditor,
    schema: EnvVarData[]
) {
    await modifyObjArg({
        callname: "z.object",
        source: sourceFile,
        modify: arg => arg.addPropertyAssignments(schema.map(
            ([name, initializer]) => ({ name, initializer })
        ))
    });
    
    for(const [key, _, value=""] of schema){
        editor.set(key, value);
    }
}