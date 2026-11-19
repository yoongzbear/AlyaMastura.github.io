// copy email with button
document.getElementById("copyEmail")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    try {
        await navigator.clipboard.writeText(btn.dataset.email);
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
    } catch {
        btn.textContent = "Press Ctrl+C";
    }
});

// nav menu for mobile wiht toggle
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

if (navToggle && navMenu) {
    const icon = navToggle.querySelector("i");

    function setMenu(open) {
        navMenu.classList.toggle("open", open);
        navToggle.setAttribute("aria-expanded", open);
        icon.className = open ? "bi bi-x-lg" : "bi bi-list";
    }

    navToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));

    navMenu.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => setMenu(false)));

    document.addEventListener("click", (e) => { if (!e.target.closest(".header")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

    // reset if become desktop width
    window.matchMedia("(min-width: 641px)").addEventListener("change", () => setMenu(false));
}

// modal for project gallery
const modal = document.getElementById("pfModal");

if (modal) {
    const stage = modal.querySelector(".pf-modal-stage");
    const caption = modal.querySelector(".pf-modal-caption");
    let items = [];
    let index = 0;

    function show(i) {
        index = (i + items.length) % items.length;
        const t = items[index];
        stage.innerHTML = "";

        if (t.dataset.youtube) {
            const frame = document.createElement("iframe");
            frame.src = `https://www.youtube-nocookie.com/embed/${t.dataset.youtube}?autoplay=1&rel=0`;
            frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
            frame.allowFullscreen = true;
            frame.title = t.dataset.title || "Project video";
            stage.appendChild(frame);
        } else {
            const img = document.createElement("img");
            img.src = t.dataset.full;
            img.alt = t.dataset.title || "";
            stage.appendChild(img);
        }

        caption.textContent = t.dataset.title || "";
        modal.classList.toggle("single", items.length < 2);
    }

    document.querySelectorAll(".pf-gallery").forEach((gallery) => {
        const thumbnails = [...gallery.querySelectorAll(".pf-thumbnail")];
        thumbnails.forEach((thumb, i) => {
            thumb.addEventListener("click", () => {
                items = thumbnails;
                show(i);
                modal.showModal();
            });
        });
    });

    modal.querySelector(".pf-prev").addEventListener("click", () => show(index - 1));
    modal.querySelector(".pf-next").addEventListener("click", () => show(index + 1));
    modal.querySelector(".pf-close").addEventListener("click", () => modal.close());

    // click on the dark backdrop closes it
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.close(); });

    // arrow keys; Esc is handled natively by <dialog>
    modal.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") show(index - 1);
        if (e.key === "ArrowRight") show(index + 1);
    });

    // clearing the stage on close stops the video from playing in the background
    modal.addEventListener("close", () => { stage.innerHTML = ""; });
}
