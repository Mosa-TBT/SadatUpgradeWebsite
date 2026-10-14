import { useDesktop } from "../context";

export default function SettingsApp() {
  const { wallpapers, wallpaper, setWallpaper, prefs, setPref } = useDesktop();

  return (
    <div className="dt-app dt-settings">
      <h3 className="dt-app-title">Personalization</h3>
      <p className="dt-app-note">
        These are demo preferences for the virtual computer only. They do not
        change any settings on your device.
      </p>

      <div className="dt-settings-group">
        <span className="dt-settings-label">Background</span>
        <div className="dt-wallpapers">
          {wallpapers.map((w) => (
            <button
              key={w.id}
              type="button"
              className={"dt-swatch" + (wallpaper === w.id ? " is-selected" : "")}
              onClick={() => setWallpaper(w.id)}
              style={{ background: w.css }}
              aria-label={w.label}
              title={w.label}
            />
          ))}
        </div>
      </div>

      <label className="dt-toggle">
        <input
          type="checkbox"
          checked={prefs.transparency}
          onChange={(e) => setPref("transparency", e.target.checked)}
        />
        <span>Window transparency</span>
      </label>
      <label className="dt-toggle">
        <input
          type="checkbox"
          checked={prefs.animations}
          onChange={(e) => setPref("animations", e.target.checked)}
        />
        <span>Window animations</span>
      </label>

      <p className="dt-app-note">Selected wallpaper: {wallpapers.find((w) => w.id === wallpaper)?.label}</p>
    </div>
  );
}
