<?php
$args_data_agrupacion = datalayerOnLoad();
?>
    <script id="gtm-header">
        let urlActual = window.location.href;
        <?php // Generamos un objeto con los valores para el datalayer ?>
        let data = {
            <?php foreach ($args_data_agrupacion as $key => $value) {?>
            '<?php echo $key; ?>': '<?php echo $value; ?>',

            <?php  }; ?>
        };
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(data);
    </script>
<?php
