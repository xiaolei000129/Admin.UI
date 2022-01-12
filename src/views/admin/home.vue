<template>
  <section class="wrap">
    <el-timeline>
      <el-timeline-item timestamp="版本 1.0.0" placement="top">
        <el-card>
          <h4>人事管理：公司组织架构维护，支持多层级结构的树形结构。</h4>
          <h4>用户管理：公司系统管理员维护、可以绑定用户角色。</h4>
          <h4>角色管理：公司组织架构角色划分，并且设置权限信息。</h4>
          <h4>
            接口管理：统一管理后端提供接口，进行后端接口可视化，并且进行后端接口颗粒权限管理。
          </h4>
          <h4>视图管理：统一管理前端页面，进行前端接口可视化管理。</h4>
          <h4>权限管理：通过视图、接口数据支持、显示权限管理。</h4>
          <h4>缓存管理：通过枚举方式呈现平台的Redis缓存管理。</h4>
          <h4>租户管理：平台对于租户进行权限分配。</h4>
          <h4>字典管理：系统内各种枚举类型、常量类型的维护。</h4>
          <h4>个人管理：用户个性化的维护自己的个人信息。</h4>
          <h4>
            文档管理：进行平台文档存档，支持Markdown格式、已经文档图片存储。
          </h4>
          <h4>
            低代码管理：
            新建对于实体之后，设置字段显示方式和添加方式，生成对应前后端代码。
          </h4>
          <h4>角色权限管理：结合权限管理数据为每一个角色分配对于权限。</h4>
          <p>段丛磊 提交于 2022-01-10</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-backtop
      target=".container .main"
      :visibility-height="200"
      class="backtop"
    />
  </section>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
h2,
h3,
h4,
h5 {
  font-weight: 400;
  color: #1f2f3d;
  margin-top: 0px;
  margin-bottom: 10px;
}
p {
  font-size: 14px;
  color: #5e6d82;
  line-height: 1.5em;
  margin-bottom: 0px;
}
.el-timeline {
  padding-left: 15px;
}

.wrap {
  padding: 20px 80px 0px 8px;
}

@media screen and (max-width: 680px) {
  .wrap {
    padding: 20px 10px 0px 8px;
  }

  .backtop {
    right: 5px !important;
    bottom: 5px !important;
  }
}
</style>
