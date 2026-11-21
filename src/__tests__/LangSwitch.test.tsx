import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import LangSwitch from "@/components/LangSwitch";

const clearCookie = () => {
  document.cookie = "tsippo-lang=; Path=/; Max-Age=0";
};

describe("LangSwitch", () => {
  beforeEach(clearCookie);

  it("remembers the chosen language in a cookie", () => {
    render(<LangSwitch lang="nl" locales={["nl", "en"]} path="/shop" label="Taal" />);
    expect(document.cookie).not.toContain("tsippo-lang");
    const en = screen.getByRole("link", { name: "EN" });
    en.addEventListener("click", (e) => e.preventDefault()); // jsdom can't navigate
    fireEvent.click(en);
    expect(document.cookie).toContain("tsippo-lang=en");
  });

  it("does not set a cookie until the visitor picks a language", () => {
    render(<LangSwitch lang="en" locales={["nl", "en"]} path="" label="Language" />);
    expect(document.cookie).toBe("");
  });
});
