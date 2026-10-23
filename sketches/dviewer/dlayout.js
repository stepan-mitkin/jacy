(function() {
function dlayout_layout(diagram: dhub_diagram, output: diagram_primitives) {
    var context;
    context = diagram_context();
    extract_diagram_context(diagram, context);
    if (is_silhouette(context)) {
        layout_silhouette(diagram, context, output);
    } else {
        layout_primitive(diagram, context, output);
    }
}
function extract_diagram_context(diagram, context) {
    var item;
    copy_str(diagram.name, context.name);
    copy_str(diagram.params, context.params);
    for (item of diagram.items) {
        if (str_equals_cstr(item.type, 'branch')) {
            insert(context.branches, item.id, item.branchId, item.content, item.one);
        }
    }
}
function is_silhouette(context) {
    if (count(context.branches) > 1) {
        return true;
    } else {
        return false;
    }
}
function layout_drakon(diagram, branch, output) {
    var next_x, skewer;
    build_manhattan(diagram, branch);
    find_skewers(branch);
    calculate_icon_sizes(branch);
    next_x = 0;
    for (skewer of branch.skewers) {
        next_x = arrange_skewer(skewer, next_x);
    }
    if (branch.params) {
        output_params(branch.skewers[0], branch.params, output);
    }
    for (skewer of branch.skewers) {
        output_lines(skewer, output.lines);
        output_icons(skewer, output.icons);
    }
}
function layout_primitive(diagram, context, output) {
    var first_branch;
    first_branch = context.branches[0];
    layout_drakon(diagram, first_branch, output);
}
window.dlayout_layout = dlayout_layout;
})();