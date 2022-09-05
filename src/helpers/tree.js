//递归获取树的深度,先序遍历的方式

export function getTreeDepth(tree) {
  if (!tree) {
    return 0;
  }
  let depth = 0;
  if (tree.length) {
    tree.forEach((child) => {
      let childDepth = getTreeDepth(child.children) + 1;
      if (childDepth > depth) {
        depth = childDepth;
      }
    });
  }
  return depth;
}

//获取tree的子元素的数量
export function getTreeChildrenLength(tree) {
  let length = 0;
  if (tree.children) {
    tree.children.forEach((child) => {
      length += getTreeChildrenLength(child);
    });
  }
  return length + 1;
}
//获取tree元素最后一级的数量
export function getTreeLastLevelLength(tree, depth) {
  let result = tree.children;
  let level = depth;
  while (level > 1) {
    result = (result.children || []).flatMap((it) => it.children);
    level--;
  }
  return result.length;
}

//获取tree的所有叶子节点
export function getTreeLeafs(tree) {
  return tree.flatMap((it) => {
    if (it.children && it.children.length) {
      return getTreeLeafs(it.children);
    } else {
      return it;
    }
  });
}

//获取第n层的所有元素
export function getTreeLevel(tree, level) {
  let result = tree;
  while (level > 0) {
    result = result.flatMap((it) => it.children || []);
    level--;
  }
  return result;
}

//获取tree的所有小于level的叶节点,level从0开始,比如
// [{ id:1}, { id:2, children:[ {id:4} , {id:5}] }, { id:3,}]
//
// getTreeNodesBeforeLevel(tree,1) 获取 [{id:1},{id:4},{id:5},{id:3}]
export function getTreeNodesBeforeLevel(tree, level) {
  if (level === 0) {
    return tree;
  }
  return tree.flatMap((it) => {
    if (it.children && it.children.length) {
      return getTreeNodesBeforeLevel(it.children, level - 1);
    } else {
      return it;
    }
  });
}

export function getFlattenTreeNodes(tree) {
  let res = [];
  tree.forEach((el) => {
    res.push(el);
    el.children && res.push(...getFlattenTreeNodes(el.children));
  });
  return res;
}

//遍历树
export function traversalTreeUp(tree, fn) {
  fn(tree);
  (tree.children || []).forEach((child) => {
    traversalTreeUp(child, fn);
  });
}

export async function traversalTreeUpSync(tree, fn) {
  if (Array.isArray(tree)) {
    for (const child of tree) {
      await traversalTreeUpSync(child, fn);
    }
  } else {
    await fn(tree);
    if (tree.children) {
      for (const child of tree.children) {
        await traversalTreeUpSync(child, fn);
      }
    }
  }
}

//树节点生成器
export function* treeTraversal(tree) {
  if (Array.isArray(tree)) {
    for (const child of tree) {
      yield* treeTraversal(child, fn);
    }
  } else {
    yield tree;
    for (const child of tree.children || []) {
      yield* treeTraversal(child);
    }
  }
}
