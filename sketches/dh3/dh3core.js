function dh3core() {
var unit = {};

function create_document(self) {
    var options;
    self.doc_creation.name = '';
    self.doc_creation.type = '';
    options = [
        {
            img: 'drakon-type.png',
            name: tr('Drakon flowchart'),
            description: tr('...'),
            value: 'drakon'
        },
        {
            img: 'drakon-ai-type.png',
            name: tr('Generate flowchart with AI'),
            description: tr('...'),
            value: 'drakon-id'
        },
        {
            img: 'graf-type.png',
            name: tr('Mind map'),
            description: tr('...'),
            value: 'graf'
        },
        {
            img: 'free-type.png',
            name: tr('Free-form diagram'),
            description: tr('...'),
            value: 'free'
        }
    ];
    self.widgets.show_rich_choice_dialog(tr('Choose diagram type'), on_document_type_chosen, self);
}
function get_current_folder(self) {
    var current;
    current = get_from_cache(self, self.current.folder_id);
    if (current.type === 'folder') {
        return current.folder_id;
    } else {
        return current.parent_id;
    }
}
function get_path_step(self) {
    var folder_id;
    if (self.go_to.current < self.go_to.path.length) {
        folder_id = self.go_to.path[self.go_to.current];
        self.go_to.current++;
        self.server.get_folder(folder_id, on_path_part, on_generic_error, self);
    } else {
        on_path_fetched(self);
    }
}
function go_to_folder(self, folder_id) {
    self.go_to.folder_id = folder_id;
    self.widgets.show_wait();
    if (self.safe_to_leave) {
        on_go_to_folder_confirmed(self);
    } else {
        widgets.ask_yes_no(tr('If you leave now, you will lose data'), tr('Leave'), tr('Cancel'), on_go_to_folder_confirmed, self);
    }
}
function on_document_created(doc, self) {
    self.widgets.hide_wait();
    self.widgets.hide_input_dialog();
    go_to_folder(self, doc.folder_id, undefined);
}
function on_document_type_chosen(doc_type, mouse_pos, self) {
    if (doc_type === 'drakon-ai') {
        create_drakon_with_ai(self);
    } else {
        self.doc_creation.type = doc_type;
        self.widgets.show_input_dialog(mouse_pos, tr('Enter diagram name'), '', document_name_checker, try_create_document, self);
    }
}
function on_failed_to_create_document(error, self) {
    self.widgets.hide_wait();
    self.widgets.set_input_dialog_error(tr(error.message));
}
function on_folder_fetched(folder, self) {
    cache_folder(self, folder);
    self.go_to.path = folder.path.map(step => step.folder_id);
    self.go_to.current = 0;
    get_path_step(self);
}
function on_go_to_folder_confirmed(self) {
    self.server.visit_folder(self.go_to.folder_id, on_folder_fetched, on_generic_error, self);
}
function on_path_fetched(self) {
    var folder, folder_id;
    self.widgets.hide_wait();
    folder_id = self.go_to.folder_id;
    folder = get_from_cache(self, folder_id);
    self.current.folder_id = folder_id;
    select_folder_in_tree(self, folder_id);
    if (folder.type === 'folder') {
        show_folder_top(self, folder);
        show_folder_content(self, folder);
    } else {
        show_diagram_top(self, folder);
        show_diagram_content(self, folder);
    }
    remember_in_recent(self, folder_id);
}
function on_path_part(folder, self) {
    cache_folder(self, folder);
    get_path_step(self);
}
function try_create_document(name, self) {
    var doc_info;
    self.widgets.show_wait();
    doc_info = {
        parent_id: get_current_folder(self),
        type: self.doc_creation.type,
        name: self.doc_creation.name
    };
    self.server.create_document(doc_info, on_document_created, on_failed_to_create_document, self);
}
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        dh3core
    };
}
