from analyzer.parsers.typescript import TypeScriptSourceParser

def test_typescript_parsing():
    code = """
import { helper } from './utils';

export interface Config {
    debug: boolean;
}

export function initApp(cfg: Config) {
    if (cfg.debug && true) {
        return helper();
    }
    return null;
}
"""
    result = TypeScriptSourceParser.parse(code, "index.ts")
    assert len(result["imports"]) == 1
    assert len(result["functions"]) == 1
    assert result["functions"][0]["name"] == "initApp"
    assert result["complexity"] >= 2
