export default function remarkStripFrontmatter() {
  return (tree, file) => {
    const source = String(file.value);
    const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);

    if (!frontmatter) return;

    tree.children = tree.children.filter(
      (node) =>
        (node.position?.end?.offset ?? Infinity) > frontmatter[0].length,
    );
  };
}
