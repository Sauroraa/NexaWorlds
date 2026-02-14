package fr.nexaworlds.nexalink;

import fr.nexaworlds.nexalink.api.ApiClient;
import fr.nexaworlds.nexalink.commands.NexaLinkCommand;
import fr.nexaworlds.nexalink.listeners.PlayerListener;
import fr.nexaworlds.nexalink.services.SyncService;
import fr.nexaworlds.nexalink.services.CommandExecutor;
import org.bukkit.plugin.java.JavaPlugin;

public class NexaLink extends JavaPlugin {

    private static NexaLink instance;
    private ApiClient apiClient;
    private SyncService syncService;
    private CommandExecutor commandExecutor;

    @Override
    public void onEnable() {
        instance = this;
        saveDefaultConfig();

        String apiUrl = getConfig().getString("api.url", "http://localhost:3001/api");
        String apiKey = getConfig().getString("api.key", "");

        this.apiClient = new ApiClient(apiUrl, apiKey);
        this.syncService = new SyncService(this, apiClient);
        this.commandExecutor = new CommandExecutor(this);

        // Register commands
        getCommand("nexalink").setExecutor(new NexaLinkCommand(this));

        // Register listeners
        getServer().getPluginManager().registerEvents(new PlayerListener(this), this);

        // Start sync tasks
        syncService.startAll();

        getLogger().info("NexaLink v" + getDescription().getVersion() + " enabled!");
        getLogger().info("API URL: " + apiUrl);
    }

    @Override
    public void onDisable() {
        if (syncService != null) {
            syncService.stopAll();
        }
        getLogger().info("NexaLink disabled.");
    }

    public static NexaLink getInstance() {
        return instance;
    }

    public ApiClient getApiClient() {
        return apiClient;
    }

    public SyncService getSyncService() {
        return syncService;
    }

    public CommandExecutor getCommandExecutor() {
        return commandExecutor;
    }
}
