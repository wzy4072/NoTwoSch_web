# Packing List Line

- Type: sku
  - id = Unique ID
  - typeId = SKU ID
  - code = SKU code
  - description = SKU name
  - quantity
  - unit
  - content:
    - volume (per item)
    - net_weight (per item)
    - weight (per item)
- Type: container
  - id = Unique ID
  - typeId = Container ID
  - code = Prefix
  - description: Container Name
  - quantity
  - unit: Container Name
  - content:
    - volume (per container)
    - net_weight (per container)
    - weight (per container)
    - children: [sub-containers, sku items for each of this Container]

## Operations

- Pack 装箱
  - 新增container
  - content.children = [sub-containers or sku items]
  - Remove Items / Update Item Quantity from PackingList
- UnPack 拆箱
  - Remove Item
  - Add Items / Update Item Quanty from content.children
