import { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLineGutter } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { lineNumbers, highlightActiveLine as highlightLine } from "@codemirror/view";
import { bracketMatching } from "@codemirror/language";
import { closeBrackets } from "@codemirror/autocomplete";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export default function JsonEditor({ 
  value, 
  onChange, 
  placeholder = "Digite seu JSON aqui...",
  readOnly = false,
  className = ""
}: JsonEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isValidJson, setIsValidJson] = useState(true);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightLine(),
        bracketMatching(),
        closeBrackets(),
        history(),
        json(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        oneDark,
        EditorView.theme({
          "&": {
            fontSize: "14px",
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          },
          ".cm-content": {
            padding: "16px",
            minHeight: "400px",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-editor": {
            borderRadius: "12px",
            border: "1px solid rgba(0, 217, 255, 0.3)",
            backgroundColor: "#0a0e27",
          },
          ".cm-editor.cm-focused": {
            borderColor: "#00d9ff",
            boxShadow: "0 0 0 2px rgba(0, 217, 255, 0.2)",
          },
          ".cm-gutters": {
            backgroundColor: "#1a1f35",
            border: "none",
            color: "#9ca3af",
          },
          ".cm-activeLineGutter": {
            backgroundColor: "rgba(0, 217, 255, 0.1)",
          },
          ".cm-activeLine": {
            backgroundColor: "rgba(0, 217, 255, 0.05)",
          },
          ".cm-cursor": {
            borderLeft: "2px solid #00d9ff",
          },
          ".cm-selectionBackground": {
            backgroundColor: "rgba(0, 217, 255, 0.2)",
          },
          ".cm-line": {
            color: "#e5e7eb",
          },
          // JSON syntax highlighting
          ".cm-atom": { color: "#fbbf24" }, // strings
          ".cm-string": { color: "#34d399" }, // strings
          ".cm-number": { color: "#60a5fa" }, // numbers
          ".cm-property": { color: "#a78bfa" }, // keys
          ".cm-bracket": { color: "#f472b6" }, // brackets
          ".cm-punctuation": { color: "#94a3b8" }, // punctuation
        }),
        EditorView.updateListener.of((update: any) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);
            validateJson(newValue);
          }
        }),
        EditorView.editable.of(!readOnly),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  // Sincroniza o editor quando o valor da prop muda
  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setIsValidJson(true);
      return;
    }

    try {
      JSON.parse(jsonString);
      setIsValidJson(true);
    } catch (error) {
      console.error("Erro ao validar JSON:", error);
      setIsValidJson(false);
    }
  };

  const formatJson = () => {
    if (!viewRef.current) return;
    
    try {
      const currentValue = viewRef.current.state.doc.toString();
      const parsed = JSON.parse(currentValue);
      const formatted = JSON.stringify(parsed, null, 2);
      
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: formatted,
        },
      });
    } catch (error) {
      console.error("Erro ao formatar JSON:", error);
    }
  };

  const clearEditor = () => {
    if (!viewRef.current) return;
    
    viewRef.current.dispatch({
      changes: {
        from: 0,
        to: viewRef.current.state.doc.length,
        insert: "",
      },
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-ai-white">
            Editor JSON
          </h3>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            isValidJson 
              ? "bg-ai-accent-green/20 text-ai-accent-green border border-ai-accent-green/30"
              : "bg-ai-accent-red/20 text-ai-accent-red border border-ai-accent-red/30"
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isValidJson ? "bg-ai-accent-green" : "bg-ai-accent-red"
            }`}></div>
            {isValidJson ? "JSON Válido" : "JSON Inválido"}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={formatJson}
            disabled={!isValidJson}
            className="px-4 py-2 bg-ai-dark-blue-card text-ai-gray border border-ai-neon-blue/30 rounded-lg hover:border-ai-neon-blue/60 hover:text-ai-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Formatar
          </button>
          <button
            onClick={clearEditor}
            className="px-4 py-2 bg-ai-dark-blue-card text-ai-gray border border-ai-accent-red/30 rounded-lg hover:border-ai-accent-red/60 hover:text-ai-accent-red transition-all duration-300"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* Editor */}
      <div 
        ref={editorRef}
        className="h-[400px] overflow-y-auto"
      />

      {/* Placeholder quando vazio */}
      {!value && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <p className="text-ai-gray-dark text-sm">
            {placeholder}
          </p>
        </div>
      )}

      {/* Error message */}
      {!isValidJson && value && (
        <div className="mt-3 p-3 bg-ai-accent-red/10 border border-ai-accent-red/30 rounded-lg">
          <p className="text-ai-accent-red text-sm">
            JSON inválido. Verifique a sintaxe e tente novamente.
          </p>
        </div>
      )}
    </div>
  );
}
