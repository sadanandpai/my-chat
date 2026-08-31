export const chatStyle = {
  border: "none",
  width: "100%",
  height: "100%",
  backgroundColor: "transparent",
  fontFamily: "var(--ui)",
  fontSize: "16px",
};

export const inputAreaStyle = {
  backgroundColor: "transparent",
  borderTop: "1px solid var(--border)",
  padding: "12px 14px 14px",
  boxShadow: "none",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
};

export const textInput = {
  placeholder: { text: "Write a message" },
  styles: {
    container: {
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      margin: "0",
      border: "1px solid var(--border)",
      borderRadius: "16px",
      backgroundColor: "var(--bg)",
      boxShadow: "none",
      padding: "4px 6px 4px 14px",
      alignItems: "center",
    },
    text: {
      fontSize: "15px",
      color: "var(--text-h)",
      padding: "10px 4px",
    },
    focus: {
      border: "1px solid var(--accent)",
      boxShadow: "0 0 0 3px var(--accent-bg)",
    },
  },
};

const submitButtonBox = {
  borderRadius: "12px",
  margin: "0",
  width: "36px",
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "none",
  top: "50%",
  bottom: "auto",
  insetBlockStart: "50%",
  insetBlockEnd: "auto",
  transform: "translateY(-50%)",
};

const submitButtonSvg = {
  width: "18px",
  height: "18px",
  display: "block",
  transform: "translate(-1px, 1px)",
};

export const submitButtonStyles = {
  position: "inside-end" as const,
  submit: {
    container: {
      default: {
        ...submitButtonBox,
        backgroundColor: "var(--accent)",
      },
      hover: {
        backgroundColor: "var(--accent)",
        filter: "brightness(1.08)",
      },
      click: {
        backgroundColor: "var(--accent)",
      },
    },
    svg: {
      styles: {
        default: {
          ...submitButtonSvg,
          filter: "none",
          fill: "var(--on-accent)",
        },
      },
    },
  },
  loading: {
    container: {
      default: {
        ...submitButtonBox,
        backgroundColor: "var(--accent)",
      },
    },
  },
  disabled: {
    container: {
      default: {
        ...submitButtonBox,
        backgroundColor: "transparent",
      },
    },
    svg: {
      styles: {
        default: {
          ...submitButtonSvg,
        },
      },
    },
  },
};

export const messageStyles = {
  default: {
    shared: {
      bubble: {
        maxWidth: "78%",
        fontSize: "15px",
        lineHeight: "1.5",
        padding: "10px 14px",
      },
    },
    user: {
      bubble: {
        backgroundColor: "var(--accent)",
        color: "var(--on-accent)",
        borderRadius: "18px 18px 6px 18px",
      },
    },
    ai: {
      bubble: {
        backgroundColor: "var(--bg)",
        color: "var(--text-h)",
        border: "1px solid var(--border)",
        borderRadius: "18px 18px 18px 6px",
      },
    },
  },
  intro: {
    bubble: {
      backgroundColor: "transparent",
      color: "var(--text)",
      border: "none",
      fontSize: "14px",
      maxWidth: "100%",
    },
  },
};

export const aiAvatar = {
  styles: {
    avatar: {
      width: "32px",
      height: "32px",
      borderRadius: "10px",
      objectFit: "cover",
    },
  },
};

export const auxiliaryStyle = `
*, *::before, *::after {
  box-sizing: border-box;
}
#input {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
}
#text-input-container {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  align-items: center;
}
.text-input-styling {
  box-sizing: border-box;
  min-width: 0;
}
.text-input-inner-end-adjustment {
  padding-inline-end: 2.75em;
}
.input-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0;
}
.input-button.inside-end {
  inset-block-start: 50%;
  inset-block-end: auto;
  top: 50%;
  bottom: auto;
  margin: 0;
  transform: translateY(-50%);
}
.loading-button {
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-submit-button {
  position: relative;
  inset: auto !important;
  inset-inline-start: auto !important;
  inset-block-end: auto !important;
  width: 16px !important;
  height: 16px !important;
  margin: 0;
  border-radius: 50%;
  background-color: transparent !important;
  box-shadow: none !important;
  border: 2px solid color-mix(in srgb, var(--on-accent) 28%, transparent);
  border-block-start-color: var(--on-accent);
  animation: loading-spinner 0.75s linear infinite !important;
}
#submit-icon {
  height: 18px;
  width: 18px;
  display: block;
  flex: none;
  transform: translate(-1px, 1px);
}
.loading-button #submit-icon {
  transform: none;
}
#messages {
  overflow-y: auto;
  overscroll-behavior: contain;
}
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 999px;
}
`;
