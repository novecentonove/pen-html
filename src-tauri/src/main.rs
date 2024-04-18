// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager};

#[derive(Clone, serde::Serialize)]
struct Payload {
  args: Vec<String>,
  cwd: String,
}

fn main() {
  tauri::Builder::default()
    .plugin(
      tauri_plugin_fs_watch::init()
    )
    .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
      println!("{}, {argv:?}, {cwd}", app.package_info().name);
      app.emit_all("single-instance", Payload { args: argv, cwd }).unwrap();
    }))
    .setup(|app| {
      match app.get_cli_matches() {
        // `matches` here is a Struct with { args, subcommand }.
        // `args` is `HashMap<String, ArgData>` where `ArgData` is a struct with { value, occurrences }.
        // `subcommand` is `Option<Box<SubcommandMatches>>` where `SubcommandMatches` is a struct with { name, matches }.
        Ok(matches) => {
          println!("{:?}", matches)
        }
        Err(_) => {}
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
