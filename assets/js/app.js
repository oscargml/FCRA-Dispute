/* FCRADisputeHelper.com — shared client-side logic */
(function () {
  "use strict";

  // Mobile nav toggle (present on every page)
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".nav-toggle");
    if (toggle) {
      var links = document.getElementById("nav-links");
      if (links) links.classList.toggle("open");
    }
  });

  // Set current year in footers
  var y = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = y; });
})();

/* ----------------------------------------------------------------
   Dispute-letter generator. Only runs when the form is on the page.
-----------------------------------------------------------------*/
(function () {
  "use strict";
  var form = document.getElementById("dispute-form");
  if (!form) return;

  var BUREAUS = {
    equifax: {
      name: "Equifax Information Services LLC",
      addr: ["P.O. Box 740256", "Atlanta, GA 30374-0256"]
    },
    experian: {
      name: "Experian",
      addr: ["P.O. Box 4500", "Allen, TX 75013"]
    },
    transunion: {
      name: "TransUnion Consumer Solutions",
      addr: ["P.O. Box 2000", "Chester, PA 19016-2000"]
    }
  };

  var preview = document.getElementById("letter-preview");
  var downloadBtn = document.getElementById("download-pdf");
  var copyBtn = document.getElementById("copy-letter");

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function selectedBureau() {
    var checked = form.querySelector('input[name="bureau"]:checked');
    return checked ? checked.value : "equifax";
  }

  function todayLong() {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  }

  function buildLetter() {
    var b = BUREAUS[selectedBureau()];
    var name = val("full-name") || "[Your Full Name]";
    var addr1 = val("address") || "[Your Street Address]";
    var cityStateZip =
      (val("city") || "[City]") + ", " + (val("state") || "[ST]") + " " + (val("zip") || "[ZIP]");

    var creditor = val("creditor") || "[Creditor / Account Name]";
    var account = val("account") || "[Account Number]";
    var errorType = val("error-type");
    var details = val("details") || "[Describe the specific inaccuracy]";

    var errorLabel = "";
    var sel = document.getElementById("error-type");
    if (sel && sel.selectedIndex >= 0) errorLabel = sel.options[sel.selectedIndex].text;
    if (errorType === "other" || !errorLabel) errorLabel = "Inaccurate information";

    var lines = [];
    lines.push(name);
    lines.push(addr1);
    lines.push(cityStateZip);
    lines.push("");
    lines.push(todayLong());
    lines.push("");
    lines.push(b.name);
    b.addr.forEach(function (l) { lines.push(l); });
    lines.push("");
    lines.push("Re: Request to Investigate and Correct Inaccurate Information");
    lines.push("");
    lines.push("To Whom It May Concern:");
    lines.push("");
    lines.push(
      "I am writing to dispute the following information that appears on my credit report. " +
      "Under Section 611 of the Fair Credit Reporting Act (15 U.S.C. § 1681i), I am exercising " +
      "my right to dispute inaccurate information and to request that you investigate and correct it."
    );
    lines.push("");
    lines.push("The item I am disputing is:");
    lines.push("");
    lines.push("    Creditor / Furnisher: " + creditor);
    lines.push("    Account Number: " + account);
    lines.push("    Nature of the error: " + errorLabel);
    lines.push("");
    lines.push("Explanation: " + details);
    lines.push("");
    lines.push(
      "This information is inaccurate and is harming my creditworthiness. I respectfully request " +
      "that you conduct a reasonable investigation under 15 U.S.C. § 1681i, contact the furnisher " +
      "of this information, and either correct or delete the disputed item. Please also send me " +
      "written confirmation of the results of your investigation and an updated copy of my credit report."
    );
    lines.push("");
    lines.push(
      "If you cannot verify this information with the original creditor within the time the FCRA " +
      "allows (generally 30 days), the item must be deleted from my file."
    );
    lines.push("");
    lines.push("I have enclosed copies (not originals) of any supporting documentation.");
    lines.push("");
    lines.push("Thank you for your prompt attention to this matter.");
    lines.push("");
    lines.push("Sincerely,");
    lines.push("");
    lines.push("");
    lines.push(name);
    if (val("ssn-last4")) lines.push("SSN (last 4): " + val("ssn-last4"));
    if (val("dob")) lines.push("Date of Birth: " + val("dob"));

    return lines.join("\n");
  }

  function render() {
    if (preview) preview.textContent = buildLetter();
  }

  form.addEventListener("input", render);
  form.addEventListener("change", render);
  render();

  // Copy to clipboard
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = buildLetter();
      navigator.clipboard.writeText(text).then(function () {
        var orig = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(function () { copyBtn.textContent = orig; }, 1800);
      });
    });
  }

  // PDF download via jsPDF
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF library is still loading. Please try again in a moment.");
        return;
      }
      var doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
      var margin = 72; // 1 inch
      var maxWidth = 612 - margin * 2;
      var text = buildLetter();
      doc.setFont("times", "normal");
      doc.setFontSize(12);

      var y = margin;
      var lineHeight = 16;
      text.split("\n").forEach(function (paragraph) {
        if (paragraph === "") { y += lineHeight; return; }
        var wrapped = doc.splitTextToSize(paragraph, maxWidth);
        wrapped.forEach(function (ln) {
          if (y > 792 - margin) { doc.addPage(); y = margin; }
          doc.text(ln, margin, y);
          y += lineHeight;
        });
      });

      var nameForFile = (val("full-name") || "dispute").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
      doc.save("fcra-dispute-letter-" + nameForFile + ".pdf");
    });
  }
})();
