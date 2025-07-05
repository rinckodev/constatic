import { CallExpression, ObjectLiteralExpression, Project, SourceFile, SyntaxKind } from "ts-morph";

interface ModifyObjArgProps {
    source: SourceFile;
    index?: number;
    callname: string;
    modify(arg: ObjectLiteralExpression): void;
}

export async function modifyObjArg(props: ModifyObjArgProps){
    const { source, callname, index=0, modify } = props;

    const callExpr = source.getFirstDescendant(node =>
        node.isKind(SyntaxKind.CallExpression) &&
        node.getExpression().getText().endsWith(callname)
    ) as CallExpression;

    if (!callExpr) return false;

    const arg = callExpr.getArguments()[index];

    if (!arg || !arg.isKind(SyntaxKind.ObjectLiteralExpression)){
        return false;
    }

    modify(arg);

    await source.save();
    return source.isSaved();
}

interface AddPropOnFuncObjArg {
    project: Project, 
    file: string, 
    callname: string,
    key: string,
    value: string,
    argIndex?: number;
};

export async function addPropToFnObjArg(props: AddPropOnFuncObjArg){
    const { project, file, callname, key, value, argIndex=0 } = props;
    
    const sourceFile = project.addSourceFileAtPath(file);

    const callExpr = sourceFile.getFirstDescendant(node =>
        node.isKind(SyntaxKind.CallExpression) &&
        node.getExpression().getText().endsWith(callname)
    ) as CallExpression;

    if (!callExpr) return false;

    const arg = callExpr.getArguments()[argIndex];

    if (!arg || !arg.isKind(SyntaxKind.ObjectLiteralExpression)){
        return false;
    }

    arg.addPropertyAssignment({
        name: key, 
        initializer: value
    });

    await sourceFile.save();
    return true;
}